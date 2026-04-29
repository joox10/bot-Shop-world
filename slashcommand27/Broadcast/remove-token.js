const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('remove-token')
        .setDescription('إزالة توكن برودكاست')
        .addStringOption(option =>
            option
                .setName('token')
                .setDescription('التوكن')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const token = interaction.options.getString('token');
            const tokens = db.get(`tokens_${interaction.guild.id}`) || [];

            if (!tokens.includes(token)) {
                return interaction.reply({ content: '**هذا التوكن غير موجود في السيرفر.**' });
            }

            await db.set(`tokens_${interaction.guild.id}`, tokens.filter(t => t !== token));
            return interaction.reply({ content: '**تم إزالة التوكن بنجاح!**' });
        } catch (error) {
            return interaction.reply({ content: `**حدث خطأ**` });
        }
    }
};
