const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const axios = require("axios");
const { token } = require("../../config.js"); // استدعاء التوكن من ملف config.js

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("banner")
        .setDescription("رؤية بانرك أو شخص آخر")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("الشخص")
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // جلب بيانات المستخدم
            const member = interaction.options.getMember("user") || interaction.member;
            const user = interaction.options.getUser("user") || interaction.user;

            // طلب بيانات المستخدم من Discord API
            const res = await axios.get(`https://discord.com/api/users/${member.id}`, {
                headers: { Authorization: `Bot ${token}` }
            });

            const { banner, accent_color } = res.data;

            if (banner) {
                // المستخدم لديه بانر
                const extension = banner.startsWith("a_") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(5)
                        .setLabel("📥 تحميل البانر")
                        .setURL(url)
                );

                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
                    .setTitle("📌 بانر المستخدم")
                    .setURL(url)
                    .setImage(url)
                    .setFooter({ text: `طلب بواسطة: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                await interaction.editReply({ embeds: [embed], components: [button] });

            } else if (accent_color) {
                // المستخدم لا يملك بانر، لكن لديه لون مخصص
                const url = `https://serux.pro/rendercolour?hex=${accent_color}&height=200&width=512`;

                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
                    .setTitle("🎨 لون الحساب")
                    .setURL(url)
                    .setImage(url)
                    .setColor(accent_color)
                    .setFooter({ text: `طلب بواسطة: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                await interaction.editReply({ embeds: [embed] });

            } else {
                // المستخدم لا يملك بانر أو لون مخصص
                await interaction.editReply({ content: "❌ **هذا المستخدم لا يملك بانر أو لون مخصص!**" });
            }

        } catch (error) {
            console.error("🔴 | حدث خطأ أثناء تنفيذ أمر /banner", error);
            await interaction.editReply({ content: "❌ **حدث خطأ! حاول مرة أخرى لاحقًا.**" });
        }
    }
};
