const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { Database } = require('st.db');
const db = new Database('/Json-db/Bots/ticketDB');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-ticket-button')
        .setDescription('تثبيت التذكرة')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ايدي الرسالة')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('button_name')
                .setDescription('اسم الزر')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('button_color')
                .setDescription('لون الزر')
                .setRequired(true)
                .addChoices(
                    { name: 'Red', value: 'red' },
                    { name: 'Green', value: 'green' },
                    { name: 'Blue', value: 'blue' },
                    { name: 'Gray', value: 'secondary' }
                )
        )
        .addRoleOption(option =>
            option.setName('support_role')
                .setDescription('رتبة الدعم')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('الكاتيجوري')
                .addChannelTypes(4)
                .setRequired(true)
        )
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
            option.setName('button_emoji')
                .setDescription('ايموجي الزر')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('ask')
                .setDescription('تفعيل أو تعطيل السؤال')
                .setRequired(false)
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' }
                )
        ),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     * @param {import('discord.js').Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
        }

        const messageId = interaction.options.getString('message_id');
        const buttonName = interaction.options.getString('button_name');
        const buttonEmoji = interaction.options.getString('button_emoji') || null;
        const buttonColor = interaction.options.getString('button_color');
        const supportRole = interaction.options.getRole('support_role');
        const category = interaction.options.getChannel('category');
        const messageType = interaction.options.getString('welcome-type');
        const askOption = interaction.options.getString('ask'); // الخيار الجديد

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            if (!message) {
                return interaction.reply({ content: 'سوي الأمر في نفس الروم اللي فيه الرسالة', ephemeral: true });
            }

            const currentComponents = message.components || [];

            const randomId = `ticket_${Math.random().toString(36).substr(2, 9)}`;

            const newButton = new ButtonBuilder()
                .setCustomId(randomId)
                .setLabel(buttonName);

            if (buttonEmoji) newButton.setEmoji(buttonEmoji); 

            switch (buttonColor) {
                case 'red':
                    newButton.setStyle(ButtonStyle.Danger);
                    break;
                case 'green':
                    newButton.setStyle(ButtonStyle.Success);
                    break;
                case 'blue':
                    newButton.setStyle(ButtonStyle.Primary);
                    break;
                default:
                    newButton.setStyle(ButtonStyle.Secondary);
            }

            const newRow = new ActionRowBuilder().addComponents([
                ...(currentComponents[0]?.components || []),
                newButton,
            ]);

            await message.edit({ components: [newRow] });

            const ticketData = {
                Support: supportRole.id,
                Category: category.id,
                Type: messageType,
                Ask: askOption // إضافة قيمة ask إلى بيانات التذكرة
            };

            await db.set(`Ticket_${interaction.channel.id}_${randomId}`, ticketData);

            await interaction.reply({ content: 'من فضلك قم بإرسال رسالة الترحيب داخل التذكرة :', ephemeral: true });
            const internalTicketCollector = interaction.channel.createMessageCollector({
                filter: m => m.author.id === interaction.user.id,
                max: 1,
                time: 60000
            });

            internalTicketCollector.on('collect', async internalTicket => {
                ticketData.Internal = internalTicket.content;
                await db.set(`Ticket_${interaction.channel.id}_${randomId}`, ticketData);

                interaction.followUp({ content: '✅ تم إضافة الزر بنجاح.', ephemeral: true });
            });

            internalTicketCollector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: '❌ انتهى الوقت، حاول مجددا.', ephemeral: true });
                }
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ حدث خطأ أثناء محاولة اضافة الزر.', ephemeral: true });
        }
    },
};
