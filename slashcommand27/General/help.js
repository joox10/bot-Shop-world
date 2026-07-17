const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('قائمة اوامر البوت'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        try {
            await interaction.deferReply();

            // تصميم الـ Embed الاحترافي بلمسة تفاعلية
            const embed = new EmbedBuilder()
                .setAuthor({ 
                    name: interaction.guild.name, 
                    iconURL: interaction.guild.iconURL({ forceStatic: false }) 
                })
                .setTitle('📋 لوحة التحكم والمساعدة')
                .setDescription(
                    `<:hop:1527591995399209010> *أممم... دعني أرى ما الذي يمكنني مساعدتك به اليوم!*\n\n` +
                    `> **يرجى اختيار القسم المراد معرفة أوامره من الأزرار بالأسفل.**`
                )
                .addFields(
                    { name: ' إحصائيات سريعة', value: `\`\`\` | يحتوي البوت على أكثر من +90 أمر جاهز لخدمتك\`\`\`` }
                )
                .setTimestamp()
                .setFooter({ 
                    text: `Developed by joox.10 | Requested By ${interaction.user.username}`, 
                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false }) 
                }) // تم إضافة توقيعك كمطور للبوت
                .setColor('#2b2d31'); // لون رمادي غامق أنيق جداً يندمج مع خلفية ديسكورد

            // الصف الأول من الأزرار
            const btns1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('help_tax').setLabel('ضريبة').setStyle(ButtonStyle.Secondary).setEmoji('💰'),
                new ButtonBuilder().setCustomId('help_autoline').setLabel('خط تلقائي').setStyle(ButtonStyle.Secondary).setEmoji('🤖'),
                new ButtonBuilder().setCustomId('help_suggestion').setLabel('اقتراحات').setStyle(ButtonStyle.Secondary).setEmoji('💡'),
                new ButtonBuilder().setCustomId('help_feedback').setLabel('اراء').setStyle(ButtonStyle.Secondary).setEmoji('💭'),
                new ButtonBuilder().setCustomId('help_system').setLabel('اوامر اداره').setStyle(ButtonStyle.Secondary).setEmoji('⚙️'),
            );

            // الصف الثاني من الأزرار
            const btns2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('help_ticket').setLabel('تكت').setStyle(ButtonStyle.Secondary).setEmoji('🎫'),
                new ButtonBuilder().setCustomId('help_giveaway').setLabel('جيف اوي').setStyle(ButtonStyle.Secondary).setEmoji('🎁'),
                new ButtonBuilder().setCustomId('help_protection').setLabel('حماية').setStyle(ButtonStyle.Secondary).setEmoji('🛡️'),
                new ButtonBuilder().setCustomId('help_logs').setLabel('لوج').setStyle(ButtonStyle.Secondary).setEmoji('📜'),
                new ButtonBuilder().setCustomId('help_apply').setLabel('تقديمات').setStyle(ButtonStyle.Secondary).setEmoji('📝'),
            );

            // الصف الثالث من الأزرار
            const btns3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('help_nadeko').setLabel('ناديكو').setStyle(ButtonStyle.Secondary).setEmoji('⏳'),
                new ButtonBuilder().setCustomId('help_autoreply').setLabel('رد تلقائي').setStyle(ButtonStyle.Secondary).setEmoji('💎'),
                new ButtonBuilder().setCustomId('help_public').setLabel('اوامر عامه').setStyle(ButtonStyle.Secondary).setEmoji('💻'),
                new ButtonBuilder().setCustomId('help_autorole').setLabel('رتب تلقائية').setStyle(ButtonStyle.Secondary).setEmoji('⚡'),
            );

            await interaction.editReply({ embeds: [embed], components: [btns1, btns2, btns3] });
        } catch (error) {
            console.log("🔴 | Error in help all in one bot", error);
        }
    }
};
