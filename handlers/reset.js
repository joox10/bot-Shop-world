const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const { Database } = require("st.db")
module.exports = (client27) => {
  client27.on(Events.InteractionCreate , async(interaction) =>{
      if (interaction.isStringSelectMenu()) {
      if(interaction.customId == 'ticket_select') {
        if(interaction.values[0] == "reset"){
            try {
                return await interaction.update().catch(async() => {return;})
              } catch  {
                return;
              }
        }
    }
  }

  
  })};