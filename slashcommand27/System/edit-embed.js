const { ChatInputCommandInteraction, Client, PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('edit-embed')
        .setDescription('تعديل إمبد تم إرساله مسبقاً')
        .addStringOption((option) => option
            .setName('message-id')
            .setDescription(`أيدي رسالة الإمبد التي تريد تعديلها`)
            .setRequired(true))
        .addStringOption((option) => option
            .setName('title')
            .setDescription(`العنوان الجديد`)
            .setRequired(false))
        .addStringOption((option) => option
            .setName('image')
            .setDescription(`رابط الصورة الجديد اسفل الاميبد`)
            .setRequired(false))
        .addStringOption((option) => option
            .setName('color')
            .setDescription(`اللون الجديد`)
            .addChoices(
                { name: `احمر`, value: 'Red' },
                { name: `ازرق`, value: 'Blue' },
                { name: `ازرق فاتح`, value: 'Aqua' },
                { name: `اخضر`, value: 'Green' },
                { name: `اصفر`, value: 'Yellow' },
                { name: `اسود`, value: 'Black' },
                { name: `ذهبي`, value: 'Gold' },
                { name: `ابيض`, value: 'White' },
                { name: `برتقالي`, value: 'Orange' },
                { name: `رمادي`, value: 'Grey' },
                { name: `بدون لون`, value: 'DarkButNotBlack' },
                { name: `عشوائي`, value: 'Random' },
            )
            .setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) 
                return interaction.reply({ content: `**لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });
            
            let messageId = interaction.options.getString('message-id');
            let title = interaction.options.getString('title');
            let image = interaction.options.getString('image');
            let color = interaction.options.getString('color');

            let targetMessage;
            try {
                targetMessage = await interaction.channel.messages.fetch(messageId);
            } catch (e) {
                return interaction.reply({ content: "**لم يتم العثور على الرسالة في هذا الروم! تأكد من الأيدي وسوي الأمر بنفس الروم.**", ephemeral: true });
            }

            if (!targetMessage.embeds || targetMessage.embeds.length === 0) {
                return interaction.reply({ content: "**هذه الرسالة لا تحتوي على إمبد لتعديله!**", ephemeral: true });
            }

            // نسخ الإمبد القديم للتعديل عليه
            let oldEmbed = targetMessage.embeds[0];
            let embed = EmbedBuilder.from(oldEmbed);

            if (title) embed.setTitle(title);
            if (color) embed.setColor(color);
            if (image && (image.startsWith('http://') || image.startsWith('https://'))) {
                embed.setImage(image);
            }

            await interaction.reply({ content: "يرجى كتابة الوصف (Description) الجديد للامبد (لديك 60 ثانية)...\n*(إذا لم تكتب شيئاً، سيتم تعديل الخيارات الأخرى فقط)*", ephemeral: true });

            const filter = (msg) => msg.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

            collector.on('collect', async (msg) => {
                embed.setDescription(msg.content);
                try { await msg.delete(); } catch (e) {}

                await targetMessage.edit({ embeds: [embed] });
                return interaction.followUp({ content: `** <:check:1527933632591691846> تم تعديل الامبد بنجاح **`, ephemeral: true });
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    try {
                        await targetMessage.edit({ embeds: [embed] });
                        interaction.followUp({ content: `**انتهى الوقت، تم حفظ التعديلات الأخرى بدون تغيير الوصف <:check:1527933632591691846>**`, ephemeral: true });
                    } catch (err) {
                        interaction.followUp({ content: "فشل التعديل التلقائي. تم إلغاء العملية.", ephemeral: true });
                    }
                }
            });
            
        } catch (error) {
            console.log(error);
            interaction.reply({ content: `حدث خطأ أثناء تعديل الإمبد.`, ephemeral: true }).catch(() => {});
        }
    }
}