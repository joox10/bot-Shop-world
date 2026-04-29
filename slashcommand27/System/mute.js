const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('إعطاء تايم اوت لشخص أو إزالته')
        .addUserOption(option => option
            .setName('member')
            .setDescription('الشخص')
            .setRequired(true))
        .addStringOption(option => option
            .setName('give_or_remove')
            .setDescription('إعطاء أو إزالة التايم اوت')
            .setRequired(true)
            .addChoices(
                { name: 'Give', value: 'Give' },
                { name: 'Remove', value: 'Remove' }
            ))
        .addStringOption(option => option
            .setName('duration')
            .setDescription('مدة التايم اوت (مثلاً: 10m, 1h, 1d)')
            .setRequired(false)),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                return interaction.reply({ content: '🚫 لا تمتلك صلاحية لفعل ذلك', ephemeral: true });
            }

            const member = interaction.options.getMember('member');
            const action = interaction.options.getString('give_or_remove');
            const duration = interaction.options.getString('duration');

            if (!member) {
                return interaction.reply({ content: '❌ العضو غير موجود', ephemeral: true });
            }

            // منع تايم اوت عن مالك السيرفر
            if (member.id === interaction.guild.ownerId) {
                return interaction.reply({ content: '⚠️ لا يمكن إعطاء تايم اوت لمالك السيرفر', ephemeral: true });
            }

            // منع معاقبة شخص أعلى منك
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ content: '🚫 لا يمكنك معاقبة شخص أعلى منك رتبة', ephemeral: true });
            }

            // ===== إزالة التايم اوت =====
            if (action === "Remove") {
                if (!member.communicationDisabledUntil) {
                    return interaction.reply({ content: '⚠️ هذا الشخص ليس عليه تايم اوت', ephemeral: true });
                }

                await member.timeout(null);
                member.send(`🔊 تم فك التايم اوت عنك في ${interaction.guild.name}`).catch(() => {});

                return interaction.reply({ content: `✅ تم فك التايم اوت عن ${member.user.tag}` });
            }

            // ===== إعطاء تايم اوت =====
            if (!duration) {
                return interaction.reply({ content: '⚠️ يجب تحديد مدة التايم اوت', ephemeral: true });
            }

            const timeMs = ms(duration);
            if (!timeMs) {
                return interaction.reply({
                    content: '⚠️ مدة غير صحيحة (مثال: 10m, 1h, 1d)',
                    ephemeral: true
                });
            }

            await member.timeout(timeMs, `By: ${interaction.user.tag}`);

            member.send(
                `🔇 تم إعطاؤك تايم اوت في ${interaction.guild.name}\n⏳ المدة: ${duration}`
            ).catch(() => {});

            return interaction.reply({
                content: `✅ تم إعطاء تايم اوت لـ ${member.user.tag} لمدة ${duration}`
            });

        } catch (error) {
            console.log(error);
            interaction.reply({
                content: '⚠️ حدث خطأ غير متوقع، تواصل مع المطورين',
                ephemeral: true
            });
        }
    }
};
