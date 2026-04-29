const {ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");


module.exports ={
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('send')
    .setDescription('لارسال رسالة لشخص ما')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص المراد الارسال له`)
        .setRequired(true))
    .addStringOption(Option => Option
            .setName(`message`)
            .setDescription(`الرسالة المراد ارسالها`)
            .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
        const sent = await interaction.deferReply({ fetchReply: true , ephemeral:false});
        const user = interaction.options.getUser(`user`)
        const message = interaction.options.getString(`message`)

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.editReply({content:`**لا تمتلك صلاحية لفعل ذلك**`})

        await user.send({embeds : [new EmbedBuilder().setTitle('رسالة جديدة').setDescription(`\`\`\`${message}\`\`\``).setFooter({text : `Sent By : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('disdis').setLabel(`${interaction.guild.name}`).setStyle(2).setDisabled(true))]})

        await interaction.editReply({content : `**تم ارسال الرسالة للعضو**`})
        } catch {
            return interaction.editReply({content:`**لم استطع الارسال للشخص**`})
        }
    }
}
 