const {
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField,
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('قول كلام في ايمبد')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('العنوان')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('رابط الصورة')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('footer')
                .setDescription('إظهار الذيل')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('الروم التي يرسل فيها الامبد')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('اللون')
                .addChoices(
                    { name: 'احمر', value: 'Red' },
                    { name: 'ازرق', value: 'Blue' },
                    { name: 'ازرق فاتح', value: 'Aqua' },
                    { name: 'اخضر', value: 'Green' },
                    { name: 'اصفر', value: 'Yellow' },
                    { name: 'اسود', value: 'Black' },
                    { name: 'ذهبي', value: 'Gold' },
                    { name: 'ابيض', value: 'White' },
                    { name: 'برتقالي', value: 'Orange' },
                    { name: 'رمادي', value: 'Grey' },
                    { name: 'بدون لون', value: 'DarkButNotBlack' },
                    { name: 'عشوائي', value: 'Random' },
                )
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply({ content: '**لا تمتلك صلاحية لفعل ذلك**', ephemeral: true });
            }

            const title = interaction.options.getString('title');
            const imageUrl = interaction.options.getString('image');
            const showFooter = interaction.options.getBoolean('footer');
            const color = interaction.options.getString('color') || 'Random';
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title);

            if (imageUrl && imageUrl.startsWith('http')) {
                embed.setImage(imageUrl);
            }

            if (showFooter) {
                embed.setFooter({ text: interaction.user.tag });
            }

            await interaction.reply({
                content: 'يرجى كتابة الرسالة التي تود وضعها في الامبد',
                ephemeral: true
            });

            const filter = msg => msg.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

            collector.on('collect', async msg => {
                embed.setDescription(msg.content);
                await msg.delete();
                await channel.send({ embeds: [embed] });
                return interaction.followUp({ content: '**تم ارسال الامبد بنجاح**', ephemeral: true });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: 'لم يتم استلام أي رسالة. تم إلغاء العملية.', ephemeral: true });
                }
            });

        } catch (error) {
            console.log(error);
            interaction.reply({ content: 'لقد حدث خطأ، اتصل بالمطورين.', ephemeral: true });
        }
    }
};
