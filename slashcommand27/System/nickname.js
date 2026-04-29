const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('تغيير اسمك المستعار أو اسم شخص آخر إذا كنت إداريًا')
        .addUserOption(option => option
            .setName('user')
            .setDescription('الشخص الذي تريد تغيير لقبه')
            .setRequired(false))
        .addStringOption(option => option
            .setName('nickname')
            .setDescription('الاسم المستعار الجديد')
            .setRequired(false)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user; // إذا لم يتم تحديد شخص، يكون المستخدم نفسه
            const targetMember = interaction.guild.members.cache.get(targetUser.id);
            const nickname = interaction.options.getString('nickname');

            // التحقق مما إذا كان المستخدم يحاول تغيير لقبه أم لقب شخص آخر
            const isSelf = targetUser.id === interaction.user.id;
            const hasManageNicknames = interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames);

            // السماح بتغيير اللقب فقط إذا كان المستخدم يحاول تغيير اسمه، أو كان لديه صلاحية "إدارة الألقاب"
            if (!isSelf && !hasManageNicknames) {
                return interaction.reply({ content: `🚫 **لا يمكنك تغيير ألقاب الآخرين!**`, ephemeral: true });
            }

            // منع تغيير اسم مالك السيرفر
            if (targetUser.id === interaction.guild.ownerId) {
                return interaction.reply({ content: `⚠️ **لا يمكنك تغيير لقب مالك السيرفر!**`, ephemeral: true });
            }

            // التحقق من أن البوت لديه الصلاحية
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                return interaction.reply({ content: `❌ **ليس لدي صلاحية "إدارة الألقاب"!**`, ephemeral: true });
            }

            // منع تغيير لقب شخص بنفس رتبة البوت أو أعلى
            if (targetMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({ content: `⚠️ **لا يمكنني تغيير لقب شخص بنفس رتبتي أو أعلى!**`, ephemeral: true });
            }

            // تغيير اللقب أو إزالته
            await targetMember.setNickname(nickname || null).then(() => {
                const embed = new EmbedBuilder()
                    .setColor(nickname ? "#00FF00" : "#FF0000")
                    .setDescription(nickname
                        ? `✅ **تم تغيير اسم المستعار لـ __${targetUser.username}__ إلى:** \`${nickname}\``
                        : `✅ **تمت إعادة ضبط اسم المستعار لـ __${targetUser.username}__ إلى الافتراضي!**`);

                return interaction.reply({ embeds: [embed] });
            }).catch(() => {
                return interaction.reply({ content: `❌ **حدث خطأ أثناء تغيير الاسم المستعار. تحقق من صلاحياتي!**`, ephemeral: true });
            });

        } catch (error) {
            console.error(`🔴 | Error in nickname command:`, error);
            return interaction.reply({ content: `❌ **حدث خطأ، يرجى التواصل مع المطورين!**`, ephemeral: true });
        }
    }
};
