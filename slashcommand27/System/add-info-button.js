const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { Database } = require('st.db');
const { v4: uuidv4 } = require('uuid');
const buttonsDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('add-info-button')
        .setDescription('إضافة زر برسالة محددة')
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('أيدي الرسالة')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('لون الزر')
                .setRequired(true)
                .addChoices(
                    { name: 'أزرق', value: 'Primary' },
                    { name: 'أحمر', value: 'Danger' },
                    { name: 'أخضر', value: 'Success' },
                    { name: 'رمادي', value: 'Secondary' },
                ))
        .addStringOption(option =>
            option.setName('label')
                .setDescription('اسم الزر')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('الإيموجي الخاص بالزر')
                .setRequired(false)), 

    async execute(interaction) {
        const label = interaction.options.getString('label') || null;
        const messageId = interaction.options.getString('message-id');
        const color = interaction.options.getString('color');
        const emoji = interaction.options.getString('emoji') || null;
        const guildId = interaction.guild.id;
        const buttonId = uuidv4(); 

        if (!label && !emoji) {
            return await interaction.reply({
                content: 'قم بوضع اسم للزر ، أو ايموجي على الأقل .',
                ephemeral: true,
            });
        }

        const button = new ButtonBuilder()
            .setCustomId(`info_${buttonId}`)
            .setStyle(ButtonStyle[color]);

        if (label) button.setLabel(label);
        if (emoji) button.setEmoji(emoji);

        try {
            const targetMessage = await interaction.channel.messages.fetch(messageId);
            if (!targetMessage) {
                return await interaction.reply({
                    content: 'سوي الأمر في نفس روم الرسالة اللي بدك تضيف فيها الزر',
                    ephemeral: true,
                });
            }

            const newRow = new ActionRowBuilder();

            if (targetMessage.components.length > 0) {
                const existingRow = targetMessage.components[0];
                existingRow.components.forEach(existingButton => {
                    newRow.addComponents(existingButton);
                });
            }

            newRow.addComponents(button);

            await targetMessage.edit({ components: [newRow] });

            await interaction.reply({
                content: 'الرجاء إرسال الرسالة التي تريد ربطها بالزر.',
                ephemeral: true,
            });

            const filter = (msg) => msg.author.id === interaction.user.id && !msg.author.bot;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

            const messageContent = collected.first().content;

            await buttonsDB.set(`${guildId}_${buttonId}`, messageContent);

            await interaction.followUp({
                content: 'تم حفظ الرسالة وربطها بالزر بنجاح!',
                ephemeral: true,
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'حدث خطأ',
                ephemeral: true,
            });
        }
    }
};
