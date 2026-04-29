const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { Database } = require('st.db');
const db = new Database("/Json-db/Bots/ticketDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('تثبيت التذكرة')
        .addStringOption(option =>
            option.setName('button_name')
                .setDescription('اسم الزر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('button_color')
                .setDescription('لون الزر')
                .addChoices(
                    { name: 'Red', value: 'red' },
                    { name: 'Green', value: 'green' },
                    { name: 'Blue', value: 'blue' },
                    { name: 'Gray', value: 'Secondary' }
                )
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('support_role')
                .setDescription('رتبة الدعم')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('الكاتيجوري')
                .addChannelTypes(4) 
                .setRequired(true))
        .addStringOption(option =>
           option.setName('welcome-type')
               .setDescription('نوع رسالة الترحيب')
               .setRequired(true)
               .addChoices(
               { name: 'Embed', value: 'embed' },
               { name: 'Message', value: 'message' }
              )
             ) 
        .addStringOption(option =>
            option.setName('ask')
                .setDescription('السؤال عن سبب فتح التكت ؟')
                .setRequired(true)
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' }
                )
             ) 
        .addStringOption(option =>
            option.setName('ticket_name')
                .setDescription('عنوان الامبد')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ticket_color')
                .setDescription('لون الامبد')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('الصورة المصغرة')
                .addChoices(
                    { name: 'Server Icon', value: 'on' },
                    { name: 'Off', value: 'off' }
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ticket_image')
                .setDescription('صورة الامبد')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('إيموجي للزر')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
        }

        const name = interaction.options.getString('ticket_name') || null;
        const color = interaction.options.getString('ticket_color') || '#808080';
        const buttonName = interaction.options.getString('button_name');
        const supportRole = interaction.options.getRole('support_role');
        const category = interaction.options.getChannel('category');
        const image = interaction.options.getString('ticket_image');
        const buttonColor = interaction.options.getString('button_color');
        const thumbnailOption = interaction.options.getString('thumbnail');
        const emoji = interaction.options.getString('emoji');
        const messageType = interaction.options.getString('welcome-type');
        const askOption = interaction.options.getString('ask'); 

        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        if (name) embed.setTitle(name);
        if (thumbnailOption === 'on') embed.setThumbnail(interaction.guild.iconURL());
        if (image) embed.setImage(image);

        const randomId = `ticket_${Math.random().toString(36).substr(2, 9)}`;
        const button = new ButtonBuilder()
            .setCustomId(randomId)
            .setLabel(buttonName);

        if (emoji) button.setEmoji(emoji); 

        switch (buttonColor) {
            case 'red':
                button.setStyle(ButtonStyle.Danger);
                break;
            case 'green':
                button.setStyle(ButtonStyle.Success);
                break;
            case 'blue':
                button.setStyle(ButtonStyle.Primary);
                break;
            default:
                button.setStyle(ButtonStyle.Secondary);
                break;
        }

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ content: 'من فضلك قم بإرسال محتوى رسالة بانل التكت:', ephemeral: true });
        const messageContentCollector = interaction.channel.createMessageCollector({
            filter: m => m.author.id === interaction.user.id,
            max: 1,
            time: 60000
        });

        messageContentCollector.on('collect', async messageContent => {
            embed.setDescription(messageContent.content);

            await interaction.followUp({ content: 'الآن، قم بإرسال رسالة الترحيب داخل التذكرة :', ephemeral: true });
            const internalTicketCollector = interaction.channel.createMessageCollector({
                filter: m => m.author.id === interaction.user.id,
                max: 1,
                time: 60000
            });

            internalTicketCollector.on('collect', async internalTicket => {
                const message = await interaction.channel.send({ embeds: [embed], components: [row] });

                await db.set(`Ticket_${interaction.channel.id}_${randomId}`, {
                    Support: supportRole.id,
                    Category: category.id,
                    Internal: internalTicket.content,
                    Type: messageType,
                    Ask: askOption 
                });

                interaction.followUp({ content: '✅ تم تثبيت التذكرة بنجاح!', ephemeral: true });
            });

            internalTicketCollector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: 'انتهئ الوقت حاول مجددا ', ephemeral: true });
                }
            });
        });

        messageContentCollector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({ content: 'انتهئ الوقت حاول مجددا', ephemeral: true });
            }
        });
    }
};
