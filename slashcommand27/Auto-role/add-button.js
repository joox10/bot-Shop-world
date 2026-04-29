const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { Database } = require('st.db');

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('add-button')
        .setDescription('اضافة زر للرتبة أخرى')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('الرتبة')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('label')
                .setDescription('اسم الزر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('ايدي الرسالة')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('لون الزر')
                .setRequired(true)
                .addChoices(
                    { name: 'أزرق', value: '1' },
                    { name: 'أحمر', value: '4' },
                    { name: 'أخضر', value: '3' },
                    { name: 'رمادي', value: '2' },
                )), 

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const label = interaction.options.getString('label');
        const messageId = interaction.options.getString('message-id');
        const color = interaction.options.getString('color');
        const guildId = interaction.guild.id;

        const button = new ButtonBuilder()
            .setCustomId(`getrole_${guildId}_${role.id}`)
            .setLabel(label)
            .setStyle(ButtonStyle[color]); 

        try {
            const targetMessage = await interaction.channel.messages.fetch(messageId);
            if (!targetMessage) {
                return await interaction.reply({ content: 'سوي الأمر في نفس روم الرسالة اللي بدك تضيف فيها الزر', ephemeral: true });
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


            await interaction.reply({ content: 'تم إضافة الزر بنجاح!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'حدث خطأ أثناء إضافة الزر!', ephemeral: true });
        }
    }
};
