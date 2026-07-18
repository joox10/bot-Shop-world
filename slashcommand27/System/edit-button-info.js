const { SlashCommandBuilder } = require('discord.js');
const { Database } = require('st.db');
const buttonsDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('edit-button-info')
        .setDescription('تعديل الرسالة المرتبطة بـ زر معلومات معين')
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('أيدي الرسالة التي تحتوي على الأزرار')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('button-number')
            .setDescription('ترتيب الزرار في الرسالة من اليسار إلى اليمين (1، 2، 3...)')
            .setRequired(true))
        .addStringOption(option => option
            .setName('new-content')
            .setDescription('النص الجديد الذي سيظهر عند الضغط على الزر')
            .setRequired(true)),

    async execute(interaction) {
        const messageId = interaction.options.getString('message-id');
        const buttonNumber = interaction.options.getInteger('button-number');
        const newContent = interaction.options.getString('new-content');
        const guildId = interaction.guild.id;

        try {
            const targetMessage = await interaction.channel.messages.fetch(messageId);
            if (!targetMessage) {
                return await interaction.reply({ content: 'قم بعمل الأمر في نفس روم الرسالة.', ephemeral: true });
            }

            if (targetMessage.components.length === 0 || targetMessage.components[0].components.length === 0) {
                return await interaction.reply({ content: 'هذه الرسالة لا تحتوي على أي أزرار!', ephemeral: true });
            }

            const allButtons = targetMessage.components[0].components;

            // التحقق من أن رقم الزرار المختار موجود فعلياً في الرسالة
            // بنقص 1 لأن الـ Arrays بتبدأ من 0
            const buttonIndex = buttonNumber - 1; 
            if (buttonIndex < 0 || buttonIndex >= allButtons.length) {
                return await interaction.reply({ 
                    content: `هذه الرسالة تحتوي على عدد (${allButtons.length}) أزرار فقط. يرجى اختيار رقم صحيح!`, 
                    ephemeral: true 
                });
            }

            // جلب الزرار المختار بناءً على الترتيب
            const selectedButton = allButtons[buttonIndex];
            const customId = selectedButton.customId; 

            if (!customId || !customId.startsWith('info_')) {
                return await interaction.reply({ content: 'الزر المختار ليس زر معلومات تابع لهذا النظام.', ephemeral: true });
            }

            // استخراج الـ buttonId عن طريق حذف info_
            const buttonId = customId.replace('info_', '');

            // التحديث في قاعدة البيانات st.db
            await buttonsDB.set(`${guildId}_${buttonId}`, newContent);

            return await interaction.reply({
                content: `<:check:1527933632591691846> تم بنجاح تعديل الرسالة المرتبطة بالزرار رقم (**${buttonNumber}**) في قاعدة البيانات!`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'حدث خطأ أثناء محاولة تعديل زر المعلومات.', ephemeral: true });
        }
    }
};