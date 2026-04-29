const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('to-select')
        .setDescription('تحويل التكت الى سلكت منيو')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ايدي الرسالة')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description1')
                .setDescription('وصف الخيار الأول')
                .setRequired(false)) 
        .addStringOption(option =>
            option.setName('description2') 
                .setDescription('وصف الخيار الثاني')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description3') 
                .setDescription('وصف الخيار الثالث')
                .setRequired(false)) 
        .addStringOption(option =>
            option.setName('description4') 
                .setDescription('وصف الخيار الرابع')
                .setRequired(false)) 
        .addStringOption(option =>
            option.setName('description5')
                .setDescription('وصف الخيار الخامس')
                .setRequired(false)), 

    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');

        const descriptions = [
            interaction.options.getString('description1'),
            interaction.options.getString('description2'),  
            interaction.options.getString('description3'), 
            interaction.options.getString('description4'),
            interaction.options.getString('description5'), 
        ];

        try {
            const message = await interaction.channel.messages.fetch(messageId);

            const buttonRow = message.components.find(row => row.components.some(component => component.type === 2));
            if (!buttonRow) {
                return interaction.reply({ content: 'لا توجد أزرار في الرسالة.', ephemeral: true });
            }

const selectMenu = new SelectMenuBuilder()
    .setCustomId('ticket_select')
    .setPlaceholder('Select Problem Type !');

buttonRow.components.forEach((button, index) => {
    const option = new StringSelectMenuOptionBuilder() 
        .setLabel(button.label)
        .setValue(button.customId);

    if (button.emoji) {
        option.setEmoji(button.emoji);
    }

    if (descriptions[index]) {
        option.setDescription(descriptions[index]);
    }

    selectMenu.addOptions(option);
});

selectMenu.addOptions(
    new StringSelectMenuOptionBuilder()
        .setLabel('Reset')
        .setValue('reset')
);



            const selectRow = new ActionRowBuilder().addComponents(selectMenu);
            await message.edit({ components: [selectRow] });

            await interaction.reply({ content: 'تم تحويل الأزرار إلى قائمة خيارات.', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'سوي الأمر في نفس الروم اللي فيه الرسالة', ephemeral: true });
        }
    }
};
