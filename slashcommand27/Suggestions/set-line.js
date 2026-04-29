const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json");
const isImage = require('is-image-header');

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-suggestions-line')
        .setDescription('تحديد الخط الاقتراحات')
        .addStringOption(option => 
            option
                .setName('line')
                .setDescription('الخط')
                .setRequired(true)), // or false
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const line = interaction.options.getString('line');
            await suggestionsDB.set(`line_${interaction.guild.id}`, line);
            let embed = new EmbedBuilder()
                .setDescription('**تم تحديد الخط**')
                .setColor('Green')
                .setImage(line)
                .setTimestamp()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log("⛔ | error in set-line command", error);
        }
    }
};
