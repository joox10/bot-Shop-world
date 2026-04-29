const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/taxDB");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-tax-line')
        .setDescription('تحديد الخط الضريبة')
        .addStringOption(option => 
            option
                .setName('line')
                .setDescription('رابط الخط')
                .setRequired(true)), // تحديد الخيار النصي بدلاً من المرفق
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const line = interaction.options.getString('line');
            await db.set(`tax_line_${interaction.guild.id}`, line);
            let embed = new EmbedBuilder()
                .setDescription(`**تم تحديد الخط**`)
                .setColor('Green')
                .setImage(line)
                .setTimestamp()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
            return interaction.editReply({ embeds: [embed] });
        } catch {
            return;
        }
    }
};
