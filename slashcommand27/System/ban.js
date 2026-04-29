const { ChatInputCommandInteraction, Client, PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('تبنيد أو فك تبنيد شخص عن طريق المنشن أو الايدي')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('منشن أو ID الشخص')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('السبب')
                .setRequired(false)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: '🚫 ليس لديك صلاحية البان', ephemeral: true });
        }

        const input = interaction.options.getString('user');
        const reason = interaction.options.getString('reason')
            ? `${interaction.options.getString('reason')} | By: ${interaction.user.tag}`
            : `By: ${interaction.user.tag}`;

        // استخراج الايدي من المنشن أو النص
        const userId = input.replace(/[<@!>]/g, '');

        if (!/^\d{17,20}$/.test(userId)) {
            return interaction.reply({ content: '❌ ايدي غير صحيح', ephemeral: true });
        }

        // منع البان عن مالك السيرفر
        if (userId === interaction.guild.ownerId) {
            return interaction.reply({ content: '⚠️ لا يمكن تبنيد مالك السيرفر', ephemeral: true });
        }

        const banList = await interaction.guild.bans.fetch();
        const isBanned = banList.has(userId);

        // ===== فك بان =====
        if (isBanned) {
            await interaction.guild.members.unban(userId, reason);
            return interaction.reply({ content: `✅ تم فك البان عن <@${userId}>` });
        }

        // ===== بان =====
        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            return interaction.reply({ content: '❌ الشخص غير موجود في السيرفر ولا هو محظور', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: '🚫 لا يمكنك تبنيد شخص أعلى منك رتبة', ephemeral: true });
        }

        await member.ban({ reason });
        return interaction.reply({ content: `✅ تم تبنيد <@${userId}> بنجاح` });
    }
};
