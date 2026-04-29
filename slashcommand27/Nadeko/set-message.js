const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/nadekoDB.json")
module.exports = {
    adminsOnly:true,
    data: new SlashCommandBuilder()
    .setName('set-message')
    .setDescription('تحديد الرسالة عند الدخول العضو')
    .addStringOption(Option => Option
        .setName(`message`)
        .setDescription(`الرسالة`)
        .setRequired(true)), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
const message = interaction.options.getString(`message`)
await db.set(`message_${interaction.guild.id}` , message)
return interaction.editReply({content:`**تم تحديد الرسالة بنجاح**`})

}
}