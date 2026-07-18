const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('التحكم في نظام الحماية التلقائي (AutoMod) للسيرفر')
        // 1. منع الكلمات البذيئة العامة
        .addSubcommand(command => 
            command.setName('flagged-words')
                   .setDescription('حظر الكلمات البذيئة والتلقائية من ديسكورد')
        )
        // 2. منع السبام والتكرار
        .addSubcommand(command => 
            command.setName('spam-msg')
                   .setDescription('منع إرسال الرسائل المزعجة (Spam)')
        )
        // 3. حد أقصى للمنشن
        .addSubcommand(command => 
            command.setName('mention-spam')
                   .setDescription('تحديد حد أقصى للمنشن في الرسالة الواحدة')
                   .addIntegerOption(option => 
                       option.setName('number')
                             .setDescription('الحد الأقصى للمنشنات المسموحة')
                             .setRequired(true)
                   )
        )
        // 4. منع كلمة معينة في الشات
        .addSubcommand(command => 
            command.setName('keywords')
                   .setDescription('حظر كلمة معينة تختارها من السيرفر')
                   .addStringOption(option => 
                       option.setName('word')
                             .setDescription('الكلمة التي تريد حظرها')
                             .setRequired(true)
                   )
        )
        // 5. منع كلمة معينة في بروفايل العضو (الاسم والحالة)
        .addSubcommand(command => 
            command.setName('profile-words')
                   .setDescription('حظر كلمات معينة من الظهور في أسماء أو حسابات الأعضاء')
                   .addStringOption(option => 
                       option.setName('word')
                             .setDescription('الكلمة الممنوعة في حساب العضو')
                             .setRequired(true)
                   )
        )
        // 6. تنظيف وحذف القواعد لتجنب امتلاء السيرفر والحد الأقصى
        .addSubcommand(command => 
            command.setName('clear')
                   .setDescription('حذف جميع قواعد الحماية التلقائية التي أنشأها البوت')
        ),

    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        // التحقق من صلاحية الإدارة
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ 
                content: '❌ لا تمتلك صلاحيات (Administrator) لاستخدام هذا الأمر.', 
                ephemeral: true 
            });
        }

        const botClientId = interaction.client.user.id;

        // 🌟 دالة مساعدة ذكية لإنشاء القواعد والتعامل مع الأخطاء بدون رسائل وهمية
        async function safeCreateRule(ruleOptions, successText) {
            try {
                const rule = await guild.autoModerationRules.create(ruleOptions);
                
                // في حال النجاح الحقيقي فقط، يرسل إمبيد النجاح
                const successEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(successText);
                    
                await interaction.editReply({ content: '', embeds: [successEmbed] });
                return rule;
            } catch (err) {
                console.error("🔴 AutoMod Creation Error:", err);
                
                let errorMsg = `❌ حدث خطأ غير متوقع أثناء محاولة إنشاء القاعدة: \`${err.message}\``;
                
                // كود 30046 في ديسكورد يعني الوصول للحد الأقصى المسموح به من القواعد (Max AutoMod Rules Reached)
                if (err.code === 30046 || err.message.toLowerCase().includes('limit') || err.message.toLowerCase().includes('maximum')) {
                    errorMsg = `⚠️ **فشل تفعيل الحماية! لقد تم الوصول للحد الأقصى لقواعد الـ AutoMod.**\n\n` +
                               `سيرفرك وصل للعدد الأقصى المسموح به من ديسكورد لهذا النوع من القواعد.\n\n` +
                               `💡 **كيف تحل المشكلة؟**\n` +
                               `• اكتب أمر \`/automod clear\` لحذف القواعد القديمة التي صنعها هذا البوت للتنظيف.\n` +
                               `• أو اذهب يدويًا إلى **إعدادات السيرفر ➜ الحماية التلقائية (Safety Setup)** واحذف أي قواعد قديمة غير مستخدمة لتوفير مساحة للبوت.`;
                }

                await interaction.editReply({ content: errorMsg, embeds: [] });
                return null;
            }
        }

        switch (sub) {
            case 'flagged-words': {
                await interaction.reply({ content: '⏳ جاري تفعيل تصفية الكلمات البذيئة...' });
                
                await safeCreateRule({
                    name: 'Block Flagged Words - AutoMod',
                    creatorId: botClientId,
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 4, // KEYWORD_PRESET
                    triggerMetadata: {
                        presets: [1, 2, 3] 
                    },
                    actions: [{ type: 1, metadata: { customMessage: 'تم حظر رسالتك تلقائياً لاحتوائها على كلمات غير لائقة.' } }]
                }, '✅ تم تفعيل حظر الكلمات البذيئة (Flagged Words) بنجاح!');
                
                break;
            }

            case 'keywords': {
                const word = options.getString('word');
                await interaction.reply({ content: `⏳ جاري حظر الكلمة [ ${word} ]...` });
                
                await safeCreateRule({
                    name: `Prevent ${word} Word - AutoMod`,
                    creatorId: botClientId,
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 1, // KEYWORD
                    triggerMetadata: {
                        keywordFilter: [word]
                    },
                    actions: [{ type: 1, metadata: { customMessage: `تم منع إرسال الكلمة المحظورة: ${word}` } }]
                }, `✅ تم بنجاح حظر الكلمة **${word}** من الشات.`);
                
                break;
            }

            case 'spam-msg': {
                await interaction.reply({ content: '⏳ جاري تفعيل نظام منع السبام...' });
                
                await safeCreateRule({
                    name: 'Prevent Spam Messages - AutoMod',
                    creatorId: botClientId,
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 3, // SPAM
                    triggerMetadata: {},
                    actions: [{ type: 1, metadata: { customMessage: 'الرجاء التوقف عن التكرار والسبام.' } }]
                }, '✅ تم تفعيل نظام منع الرسائل العشوائية (Spam) بنجاح!');
                
                break;
            }

            case 'mention-spam': {
                const number = options.getInteger('number');
                await interaction.reply({ content: `⏳ جاري تفعيل مانع سبام المنشن بالحد الأقصى (${number})...` });
                
                await safeCreateRule({
                    name: 'Prevent Mention Spam - AutoMod',
                    creatorId: botClientId,
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 5, // MENTION_SPAM
                    triggerMetadata: {
                        mentionTotalLimit: number
                    },
                    actions: [{ type: 1, metadata: { customMessage: `رسالتك تحتوي على أكثر من ${number} منشن.` } }]
                }, `✅ تم تفعيل مانع منشن سبام! الحد الأقصى للمنشن المسموح به: **${number}**.`);
                
                break;
            }

            case 'profile-words': {
                const word = options.getString('word');
                await interaction.reply({ content: `⏳ جاري حظر الكلمة [ ${word} ] من ملفات الأعضاء...` });

                await safeCreateRule({
                    name: `Block Profile Word: ${word}`,
                    creatorId: botClientId,
                    enabled: true,
                    eventType: 2, // MEMBER_PROFILE_UPDATE
                    triggerType: 6, // MEMBER_PROFILE
                    triggerMetadata: {
                        keywordFilter: [word]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                customMessage: `تم حجب حسابك لاحتوائه على كلمة ممنوعة: ${word}`
                            }
                        }
                    ]
                }, `✅ تم تفعيل حظر الكلمة **${word}** في أسماء وحسابات الأعضاء بنجاح!`);
                
                break;
            }

            case 'clear': {
                await interaction.reply({ content: '⏳ جاري تنظيف وإلغاء تفعيل قواعد الـ AutoMod...' });
                
                const rules = await guild.autoModerationRules.fetch().catch(() => null);
                if (!rules) return await interaction.editReply({ content: '❌ لم أتمكن من جلب قواعد السيرفر.' });

                // تصفية القواعد التي صنعها هذا البوت فقط
                const botRules = rules.filter(r => r.creatorId === botClientId);

                if (botRules.size === 0) {
                    return await interaction.editReply({ content: '❌ لا توجد قواعد حماية نشطة تم إنشاؤها بواسطة هذا البوت حالياً.' });
                }

                try {
                    for (const [id, rule] of botRules) {
                        await rule.delete().catch(console.error);
                    }

                    const embedClear = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`🧹 تم بنجاح حذف وإيقاف جميع قواعد الحماية التلقائية (**${botRules.size}**) التي أنشأها البوت.`);
                    
                    await interaction.editReply({ content: '', embeds: [embedClear] });
                } catch (err) {
                    console.error(err);
                    await interaction.editReply({ content: `❌ حدث خطأ أثناء حذف القواعد: \`${err.message}\`` });
                }
                break;
            }
        }
    }
};