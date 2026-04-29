const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/ticketDB");

module.exports = {
    adminsOnly: false,
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('إغلاق التذكرة الحالية'),
    
    /**
     * @param { import('discord.js').ChatInputCommandInteraction } interaction 
     */
    async execute(interaction) {
        const supportRoleID = db.get(`TICKET-PANEL_${interaction.channel.id}`)?.Support;

/*        if (!interaction.member.roles.cache.has(supportRoleID)) {
            return interaction.reply({ content: `:x: You do not have permission to close this ticket.`, ephemeral: true });
        }*/

        const ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);

        await interaction.channel.permissionOverwrites.edit(ticket.author, { ViewChannel: false });

        const embed2 = new EmbedBuilder()
            .setDescription(`تم اغلاق تذكرة بواسطة ${interaction.user}`)
            .setColor("Yellow");

        const embed = new EmbedBuilder()
            .setDescription("```لوحة فريق الدعم.```")
            .setColor("DarkButNotBlack");

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('delete').setLabel('Delete').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('Open').setLabel('Open').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('Tran').setLabel('Transcript').setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed2, embed], components: [row] });

        const logsRoomId = db.get(`LogsRoom_${interaction.guild.id}`);
        const logChannel = interaction.guild.channels.cache.get(logsRoomId);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTitle('Close Ticket')
          .setFields(
            { name: `Name Ticket`, value: `${interaction.channel.name}` },
            { name: `Owner Ticket`, value: `${ticket.author}` },
            { name: `Close BY Ticket`, value: `${interaction.user}` },
          )
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};
