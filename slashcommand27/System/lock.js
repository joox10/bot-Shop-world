const { Client, Collection, PermissionsBitField, SlashCommandBuilder, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('قفل الروم'),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) 
                return interaction.reply({ content: '**لا تمتلك صلاحية لفعل ذلك**', ephemeral: true });

            await interaction.deferReply({ ephemeral: false });

            await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, { SendMessages: false });

            return interaction.editReply({ content: `**${interaction.channel} has been locked**` });
        } catch (error) {
            interaction.reply({ content: `لقد حدث خطا اتصل بالمطورين`, ephemeral: true });
            console.log(error);
        }
    }
};
