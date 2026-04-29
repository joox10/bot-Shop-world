const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/nadekoDB.json")
module.exports = {
    adminsOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-nadeko-room')
    .setDescription('ازالة روم مفعل الخاصية منشن فيها')
    .addChannelOption(Option => Option
        .setName(`room`)
        .setDescription(`الروم`)
        .setRequired(true)), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
const room = interaction.options.getChannel(`room`)
let rooms = db.get(`rooms_${interaction.guild.id}`)
if(!rooms) {
    await db.set(`rooms_${interaction.guild.id}` , [])
}
rooms = db.get(`rooms_${interaction.guild.id}`)
if(!rooms.includes(room.id)) {
    return interaction.editReply({content:`**لم يتم اضافة هذه الروم من قبل لكي يتم الحذف**`})
}
const filtered = await rooms.filter(ro => ro != room.id)
await db.set(`rooms_${interaction.guild.id}` , filtered)
return interaction.editReply({content:`**تم ازالة الروم بنجاح**`})

}
}