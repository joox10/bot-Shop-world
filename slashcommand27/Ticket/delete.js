const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database('/Json-db/Bots/ticketDB');

module.exports = {
    adminsOnly: false,
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('حذف التذكرة الحالية'),
        
    async execute(interaction) {
        const Support = db.get(`TICKET-PANEL_${interaction.channel.id}`)?.Support;
        if (!interaction.member.roles.cache.has(Support)) {
            return interaction.reply({ content: ':x: Only Support', ephemeral: true });
        } 

        if (!db.has(`TICKET-PANEL_${interaction.channel.id}`)) {
            return interaction.reply({ content: 'This channel isn\'t a ticket', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('Ticket will be deleted in a few seconds');
        
        await interaction.reply({ embeds: [embed] });
        
        setTimeout(() => {
            interaction.channel.delete();
        }, 4500);

        const Logs = db.get(`LogsRoom_${interaction.guild.id}`);
        const Log = interaction.guild.channels.cache.get(Logs);
        const Ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);
        const logEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTitle('Delete Ticket')
            .addFields(
                { name: 'Name Ticket', value: `${interaction.channel.name}` },
                { name: 'Owner Ticket', value: `${Ticket.author}` },
                { name: 'Deleted By', value: `${interaction.user}` },
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        Log?.send({ embeds: [logEmbed] });
        db.delete(`TICKET-PANEL_${interaction.channel.id}`);
    }
}
