const { SlashCommandBuilder } = require('@discordjs/builders');
const { Database } = require('st.db');
const taxDB = new Database("/Json-db/Bots/taxDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('tax-mode')
        .setDescription('اختيار بين استخدام امبد أو رسالة عادية')
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('اختر مابين الامبد أو الرسالة العادية')
                .setRequired(true)
                .addChoices(
                    { name: 'امبد', value: 'embed' },
                    { name: 'رسالة عادية', value: 'message' },
                ))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('لون الامبد بـ hex code')
                .setRequired(false)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const color = interaction.options.getString('color') || '#0099FF'; 

        await taxDB.set(`tax_mode_${interaction.guild.id}`, mode);
        await taxDB.set(`tax_color_${interaction.guild.id}`, color);

        await interaction.reply({ content: `تم ضبط وضع الضريبة على ${mode}`, ephemeral: true });
    },
};
