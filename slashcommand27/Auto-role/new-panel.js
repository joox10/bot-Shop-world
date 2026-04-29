const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { Database } = require("st.db");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName('new-panel')
    .setDescription('لاضافة بنل اعطاء رتب')
    .addChannelOption(option =>
      option.setName('room')
        .setDescription('الروم')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('الرتبة')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('label')
        .setDescription('اسم الزر')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message_type')
        .setDescription('نوع الرسالة')
        .setRequired(true)
        .addChoices(
          { name: 'Embed', value: 'embed' },
          { name: 'Normal', value: 'regular' }
        ))
    .addStringOption(option =>
      option.setName('button_color')
        .setDescription('لون الزر')
        .setRequired(true)
        .addChoices(
          { name: 'أحمر', value: 'Danger' },
          { name: 'أزرق', value: 'Primary' },
          { name: 'أخضر', value: 'Success' },
          { name: 'رمادي', value: 'Secondary' }
        ))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('الصورة في الامبد'))
    .addStringOption(option =>
      option.setName('embed_color')
        .setDescription('لون الأيمبد '))
    .addStringOption(option =>
      option.setName('embed_title')
        .setDescription('عنوان الأيمبد')),

  async execute(interaction) {
    const room = interaction.options.getChannel('room');
    const role = interaction.options.getRole('role');
    const label = interaction.options.getString('label');
    const messageType = interaction.options.getString('message_type');
    const buttonColor = interaction.options.getString('button_color');
    const imageUrl = interaction.options.getString('image');
    const embedColor = interaction.options.getString('embed_color');
    const embedTitle = interaction.options.getString('embed_title');
    const guildId = interaction.guild.id;

    const button = new ButtonBuilder()
      .setCustomId(`getrole_${guildId}_${role.id}`)
      .setLabel(label)
      .setStyle(buttonColor);

    const row = new ActionRowBuilder().addComponents(button);

    const modalCustomId = `inputMessage_${interaction.id}_${interaction.user.id}`;

    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle(messageType === 'embed' ? 'أدخل تفاصيل الأيمبد' : 'أدخل محتوى الرسالة');

    const descriptionInput = new TextInputBuilder()
      .setCustomId('message_content')
      .setLabel(messageType === 'embed' ? 'وصف الأيمبد' : 'محتوى الرسالة')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(descriptionInput));

    await interaction.showModal(modal);

    const filter = i => i.customId === modalCustomId && i.user.id === interaction.user.id;

    interaction.awaitModalSubmit({ filter, time: 60000 })
      .then(async (submitted) => {
        const messageContent = submitted.fields.getTextInputValue('message_content');


        if (messageType === 'embed') {
          const embed = new EmbedBuilder()
            .setDescription(messageContent)
            .setColor(embedColor || '#2F3136');

          if (embedTitle) {
            embed.setTitle(embedTitle);
          }

          if (imageUrl) {
            embed.setImage(imageUrl);
          }

          await room.send({ embeds: [embed], components: [row] });
        } else {
          await room.send({ content: messageContent, components: [row] });
        }

        await submitted.reply({ content: 'تم تسطيب البنل بنجاح', ephemeral: true });
      })
      .catch(() => {
        interaction.followUp({ content: 'انتهى الوقت حاولا مجددا.', ephemeral: true });
      });
  }
};
