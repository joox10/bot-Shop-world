const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db");
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json");
const ms = require("ms");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('بدأ جيف اواي')
        .addStringOption(Option =>
            Option.setName('duration')
                .setDescription('المدة')
                .setRequired(true))
        .addIntegerOption(Option => Option
            .setName('winners')
            .setDescription('عدد الفائزين')
            .setRequired(true))
        .addStringOption(Option => Option
            .setName('prize')
            .setDescription('الجائزة')
            .setRequired(true)),

    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const winners = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        const hasTimeUnit = /[mdhs]/i.test(duration);
        await interaction.deferReply({ ephemeral: true });
        if (!hasTimeUnit) return interaction.editReply({ content: '**الرجاء تحديد الوقت بطريقة صحيحة**', ephemeral: true });

        const remainingTimeMs = ms(duration);
        const endTime = Date.now() + remainingTimeMs;
        const dir1 = Math.floor(endTime / 1000);
        const dir2 = endTime;

        const embed = new EmbedBuilder()
            .setTitle(`**${prize}**`)
            .setDescription(`Ends : <t:${dir1}:R> (<t:${dir1}:f>)\nHosted by : ${interaction.user}\nEntries : **0**\nWinners: **${winners}**`)
            .setColor(`#5865f2`)
            .setTimestamp(dir2);

        const button = new ButtonBuilder()
            .setEmoji(`🎉`)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`join_giveaway`)
            .setDisabled(false);

        const row = new ActionRowBuilder().addComponents(button);
        await interaction.editReply({ content: `**تم انشاء الجيف اواي بنجاح**`, ephemeral: true });

        let giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`) || [];
        const send2 = await interaction.channel.send({ embeds: [embed], components: [row] });

        giveaways.push({ messageid: send2.id, channelid: interaction.channel.id, entries: [], winners: winners, prize: prize, duration: remainingTimeMs, dir1: dir1, dir2: dir2, host: interaction.user.id, ended: false });
        await giveawayDB.set(`giveaways_${interaction.guild.id}`, giveaways);

        // ✅ **إضافة مؤقت لإنهاء الجيف أواي تلقائيًا**
        setTimeout(async () => {
            let updatedGiveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`) || [];
            let giveaway = updatedGiveaways.find(g => g.messageid === send2.id);
            if (!giveaway || giveaway.ended) return;

            giveaway.ended = true;
            await giveawayDB.set(`giveaways_${interaction.guild.id}`, updatedGiveaways);

            const channel = interaction.guild.channels.cache.get(giveaway.channelid);
            if (!channel) return;

            const message = await channel.messages.fetch(giveaway.messageid).catch(() => null);
            if (!message) return;

            // اختيار الفائزين
            let entries = giveaway.entries;
            let winnersList = "**لم يشارك أحد في الجيف أواي.**";

            if (entries.length > 0) {
                const selectedWinners = entries.sort(() => Math.random() - 0.5).slice(0, Math.min(winners, entries.length));
                winnersList = selectedWinners.map(id => `${id}`).join(", ");
            }

        
            const updatedEmbed = new EmbedBuilder()
            .setTitle(` **${prize}** `)
            .setDescription(`Ended in : <t:${dir1}:R> (<t:${dir1}:f>)\n Hosted by : <@${giveaway.host}>\n To receive open a ticket: \nWinners: ${winnersList}`)
            .setColor(`#5865f2`)
            .setTimestamp() 
            

        await message.edit({ embeds: [updatedEmbed], components: [] });
            await channel.send(`🎉 ${winnersList}  You won **${prize}** ! `);
        }, remainingTimeMs);
    }
};
