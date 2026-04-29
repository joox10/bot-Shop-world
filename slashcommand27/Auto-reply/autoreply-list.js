const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const one4allDB = new Database("/Json-db/Bots/one4allDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('autoreply-list')
        .setDescription('لرؤية جميع الردود'),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const data = await one4allDB.get(`replys_${interaction.guild.id}`);

            if (!data || data.length === 0) {
                return interaction.editReply({ content: "**لا توجد أي ردود تلقائية مسجلة لهذا السيرفر.**" });
            }

            const embeds = [];
            let currentEmbed = new EmbedBuilder()
                .setTitle('جميع الردود التلقائية')
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                .setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            let count = 0;

            for (const d of data) {
                let { word, reply } = d;

                // التأكد من أن الرد لا يتجاوز 1024 حرفًا
                if (reply.length > 1024) {
                    reply = reply.substring(0, 1021) + "..."; // قص النص وإضافة ...
                }

                currentEmbed.addFields({ name: `الكلمة: \`${word}\``, value: `**الرد:** __${reply}__` });

                count++;

                // إذا وصلنا إلى 25 حقلًا، ننشئ Embed جديد
                if (count % 25 === 0) {
                    embeds.push(currentEmbed);
                    currentEmbed = new EmbedBuilder()
                        .setTitle('جميع الردود التلقائية (تكملة)')
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                }
            }

            // إضافة آخر Embed إلى القائمة
            embeds.push(currentEmbed);

            return interaction.editReply({ embeds });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: "**لقد حدث خطأ، يرجى الاتصال بالمطورين.**" });
        }
    }
};
