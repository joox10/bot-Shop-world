const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    adminsOnly:true,
    data: new SlashCommandBuilder()
        .setName('copy-emoji')
        .setDescription('لنسخ ايموجي')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('الإيموجي')
                .setRequired(true)
        ),

    async execute(interaction) {
        const emojiInput = interaction.options.getString('emoji');
        const emojiURL = getEmojiURL(emojiInput);

        if (!emojiURL) {
            return interaction.reply({ content: 'هناك خطأ ، قم باختيار ايموجي صحيح', ephemeral: true });
        }

        const emojiName = emojiInput.match(/:(\w+):/)[1];

        try {
            const emoji = await interaction.guild.emojis.create({ attachment: emojiURL, name: emojiName });
            return interaction.reply(`تم نسخ الإيموجي بنجاح: ${emoji}`);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'حدث خطأ أثناء رفع الإيموجي.', ephemeral: true });
        }
    }
};

function getEmojiURL(emojiInput) {
    const emojiRegex = /<:.+:(\d+)>|<a:.+:(\d+)>/;
    const match = emojiInput.match(emojiRegex);
    if (match) {
        const emojiId = match[1] || match[2];
        const isAnimated = emojiInput.startsWith('<a:');
        return `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`;
    }
    return null;
}
