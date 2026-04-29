const { SlashCommandBuilder } = require('@discordjs/builders');
const { Database } = require('st.db');
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('feedback-mode')
        .setDescription('امبد أو رياكشن فقط')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('اختر بين الامبد والرياكشن')
                .setRequired(true)
                .addChoices(
                    { name: 'امبد', value: 'embed' },
                    { name: 'أوتو رياكشن فقط', value: 'reactions' },
                ))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('الايموجي (لوضع الاوتو رياكشن فقط)')
                .setRequired(false)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const emoji = interaction.options.getString('emoji') || '❤'; 

        await feedbackDB.set(`feedback_mode_${interaction.guild.id}`, mode);
        await feedbackDB.set(`feedback_emoji_${interaction.guild.id}`, emoji);

        await interaction.reply({ content: `تم ظبط وضع الأراء على ${mode}`, ephemeral: true });
    },
};
