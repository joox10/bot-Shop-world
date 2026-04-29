const { SlashCommandBuilder, Events, Client, ActivityType, ModalBuilder, TextInputStyle, EmbedBuilder, PermissionsBitField, ButtonStyle, TextInputBuilder, ActionRowBuilder, ButtonBuilder, MessageComponentCollector } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB")

module.exports = (client27) => {
    client27.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId === "run_broadcast_button") {
                await interaction.deferReply({ ephemeral: true });

                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('send_online')
                            .setLabel('إرسال للأونلاين')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('send_offline')
                            .setLabel('إرسال للأوفلاين')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('send_all')
                            .setLabel('إرسال للجميع')
                            .setStyle(ButtonStyle.Primary)
                    );

                await interaction.editReply({ content: 'اختر نوع الارسال:', components: [buttons], ephemeral: true });
            }

            if (interaction.customId === 'send_online' || interaction.customId === 'send_offline' || interaction.customId === 'send_all') {
                await interaction.deferReply({ ephemeral: false });

                const thetokens = db.get(`tokens_${interaction.guild.id}`);
                if (!thetokens || thetokens.length <= 0) return interaction.editReply({ content: `**لم يتم اضافة اي توكن لبوتات البرودكاست**`, ephemeral: true });
                const broadcast_msg = db.get(`broadcast_msg_${interaction.guild.id}`);
                if (!broadcast_msg) return interaction.reply({ content: `**لم يتم تحديد رسالة البرودكاست**`, ephemeral: true });

                await interaction.guild.members.fetch();
                let allMembers = await interaction.guild.members.cache;

                // تحديد أعضاء حسب حالة الاتصال وتجاهل البوتات
                if (interaction.customId === 'send_online') {
                    allMembers = allMembers.filter(mem =>
                        !mem.user.bot && (
                        mem.presence?.status === 'online' ||
                        mem.presence?.status === 'dnd' ||
                        mem.presence?.status === 'idle' ||
                        mem.presence?.activities.some(activity => activity.type === ActivityType.Streaming))
                    );
                } else if (interaction.customId === 'send_offline') {
                    allMembers = allMembers.filter(mem => !mem.user.bot && (!mem.presence || mem.presence.status === 'offline'));
                } else if (interaction.customId === 'send_all') {
                    allMembers = allMembers.filter(mem => !mem.user.bot);
                }

                allMembers = allMembers.map(mem => mem.user.id);

                const botsNum = thetokens.length;
                const membersPerBot = Math.floor(allMembers.length / botsNum);
                const submembers = [];
                for (let i = 0; i < allMembers.length; i += membersPerBot) {
                    submembers.push(allMembers.slice(i, i + membersPerBot));
                }
                if (submembers.length > botsNum) {
                    submembers.pop();
                }
                let donemembers = 0;
                let faildmembers = 0;

                let embed1 = new EmbedBuilder()
                    .setTitle(`**تم البدأ في ارسال رسالة البرودكاست**`)
                    .setColor('Aqua')
                    .setDescription(`**⚫ عدد الاعضاء : \`${allMembers.length}\`\n🟢 تم الارسال الى : \`${donemembers}\`\n🔴فشل الارسال الى : \`${faildmembers}\`**`);
                const mesg = await interaction.editReply({ embeds: [embed1] });

                for (let i = 0; i < submembers.length; i++) {
                    const token = thetokens[i];
                    let clienter = new Client({ intents: 131071 });
                    await clienter.login(token);
                    submembers[i].forEach(async (sub) => {
                        await clienter.users.fetch(sub);
                        try {
                            const theuser = await clienter.users.cache.find(mem => mem.id == sub).send({ content: `**${broadcast_msg}\n<@${sub}>**` })
                                .then(async (msg) => {
                                    ++donemembers;
                                    let embed2 = new EmbedBuilder()
                                        .setTitle(`**تم البدأ في ارسال رسالة البرودكاست**`)
                                        .setColor('Aqua')
                                        .setDescription(`**⚫ عدد الاعضاء : \`${allMembers.length - 1}\`\n🟢 تم الارسال الى : \`${donemembers}\`\n🔴 فشل الارسال الى : \`${faildmembers}\`**`);
                                    mesg.edit({ embeds: [embed2] });
                                    if ((donemembers + faildmembers) >= (allMembers.length - 1)) {
                                        let embed3 = new EmbedBuilder()
                                            .setTitle(`**تم الانتهاء من ارسال رسالة البرودكاست**`)
                                            .setColor("Green")
                                            .setDescription(`**⚫ عدد الاعضاء : \`${allMembers.length - 1}\`\n🟢 تم الارسال الى : \`${donemembers}\`\n🔴 فشل الارسال الى : \`${faildmembers}\`**`);
                                        return mesg.edit({ embeds: [embed3] });
                                    }
                                })
                                .catch(async (msg) => {
                                    ++faildmembers;
                                    let embed2 = new EmbedBuilder()
                                        .setTitle(`**تم البدأ في ارسال رسالة البرودكاست**`)
                                        .setColor('Aqua')
                                        .setDescription(`**⚫ عدد الاعضاء : \`${allMembers.length - 1}\`\n🟢 تم الارسال الى : \`${donemembers}\`\n🔴 فشل الارسال الى : \`${faildmembers}\`**`);
                                    mesg.edit({ embeds: [embed2] });
                                    if ((donemembers + faildmembers) >= (allMembers.length - 1)) {
                                        let embed3 = new EmbedBuilder()
                                            .setTitle(`**تم الانتهاء من ارسال رسالة البرودكاست**`)
                                            .setColor("Green")
                                            .setDescription(`**⚫ عدد الاعضاء : \`${allMembers.length - 1}\`\n🟢 تم الارسال الى : \`${donemembers}\`\n🔴 فشل الارسال الى : \`${faildmembers}\`**`);
                                        return mesg.edit({ embeds: [embed3] });
                                    }
                                });
                        } catch { }
                    });
                }
            }
        }
    });
};
