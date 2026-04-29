const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/ticketDB");

module.exports = {
    adminsOnly: false,
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('إعادة تسمية التذكرة الحالية')
        .addStringOption(option => 
            option
                .setName('name')
                .setDescription('Enter the new channel name')
                .setRequired(true)
        ),
    
    /**
     * @param { import('discord.js').ChatInputCommandInteraction } interaction 
     */
    async execute(interaction) {
        const dd = new Database("/Json-db/Bots/ticketDB");
        const supportRoleID = dd.get(`TICKET-PANEL_${interaction.channel.id}`)?.Support;

        if (!interaction.member.roles.cache.has(supportRoleID)) {
            return interaction.reply({ content: `:x: You do not have permission to rename this ticket.`, ephemeral: true });
        }

        const newName = interaction.options.getString('name');
        const ticketData = db.get(`TICKET-PANEL_${interaction.channel.id}`);
        
        if (!ticketData) {
            return interaction.reply({ content: `> This channel isn't a ticket`, ephemeral: true });
        }

        if (!newName) {
            return interaction.reply({ content: `No new name provided for the ticket channel.`, ephemeral: true });
        }

        await interaction.channel.setName(newName);
        return interaction.reply({ content: `ticket renamed`, ephemeral: true });
    }
};
