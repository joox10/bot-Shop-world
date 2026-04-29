const { Client, Collection,SlashCommandBuilder,ChannelType , discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('رؤية معلومات السيرفر   '), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    const embed = new EmbedBuilder()
    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
    .setColor(`Random`)
    .addFields(
        {
            name:`**🆔 Server ID:**` , value:interaction.guild.id , inline:false
        },
        {
            name:`**📆 Created On:**` , value:`**<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>**` , inline:false
        },
        {
            name:`**👑 Owned By :**` , value:`**<@${interaction.guild.ownerId}>**` , inline:false
        },
        {
            name:`**👥 Members (${interaction.guild.memberCount})**` , value:`**${interaction.guild.premiumSubscriptionCount} Boosts ✨**` , inline:false
        },
        {
            name:`**💬 Channels (${interaction.guild.channels.cache.size})**` , value:`**${interaction.guild.channels.cache.filter((r) => r.type == ChannelType .GuildText).size}** Text | **${
                interaction.guild.channels.cache.filter((r) => r.type == ChannelType .GuildVoice).size
            }** Voice | **${interaction.guild.channels.cache.filter((r) => r.type === ChannelType.GuildCategory).size}** Category` , inline:false
       
        },
        {
            name: '🌍 Others',
            value: `**Verification Level:** ${interaction.guild.verificationLevel}`,
            inline: false,
        },
    )
    .setThumbnail(interaction.guild.iconURL({dynamic:true}))
    return interaction.editReply({embeds:[embed]})
}
}
