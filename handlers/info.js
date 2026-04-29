const { Events } = require("discord.js");
const { Database } = require('st.db');
const buttonsDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
      if (!interaction.customId.startsWith('info_')) return;

      let [, buttonId] = interaction.customId.split('_'); 

      try {
        const guildId = interaction.guild.id;
        const savedMessage = await buttonsDB.get(`${guildId}_${buttonId}`);

        if (savedMessage) {
          await interaction.reply({ content: savedMessage, ephemeral: true });
        } else {
          await interaction.reply({ content: 'لم يتم العثور على رسالة مرتبطة بهذا الزر.', ephemeral: true });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'حدث خطأ ، أو ان الرسالة طويلة جدا', ephemeral: true });
      }
    }
  });
};
