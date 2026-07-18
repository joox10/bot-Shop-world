const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('edit-say')
        .setDescription('تعديل رسالة ساي أرسلها البوت مسبقاً')
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('أيدي الرسالة التي تريد تعديلها')
            .setRequired(true))
        .addStringOption(option => option
            .setName('sentence')
            .setDescription('الجملة الجديدة')
            .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) 
            return interaction.reply({ content: `**لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });

        const messageId = interaction.options.getString('message-id');
        const sentence = interaction.options.getString('sentence');

        try {
            const targetMessage = await interaction.channel.messages.fetch(messageId);
            
            if (targetMessage.author.id !== interaction.client.user.id) {
                return interaction.reply({ content: "**لا يمكنني تعديل رسالة لم أقم بإرسالها بنفسي!**", ephemeral: true });
            }

            await targetMessage.edit({ content: `${sentence}` });
            
            return interaction.reply({ content: `**Done Modified**`, ephemeral: true }).then(async (msg) => {
                setTimeout(() => { msg.delete().catch(() => {}); }, 1500);
            });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '**حدث خطأ، تأكد من أيدي الرسالة وأنك في نفس الروم!**', ephemeral: true });
        }
    }
}