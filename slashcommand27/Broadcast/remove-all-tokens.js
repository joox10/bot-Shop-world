const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('remove-all-tokens')
        .setDescription('إزالة جميع بوتات البرودكاست'),
    async execute(interaction) {
        try {
            await db.delete(`tokens_${interaction.guild.id}`);
            return interaction.reply({ content: '**تم إزالة جميع التوكنات من السيرفر بنجاح!**' });
        } catch (error) {
            return interaction.reply({ content: `**حدث خطأ**` });
        }
    }
};
