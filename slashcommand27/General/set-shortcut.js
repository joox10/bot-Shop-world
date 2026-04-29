const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const shortcutDB = new Database("/Json-db/Others/shortcutDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-shortcut')
        .setDescription('تحديد اختصار لأمر معين')
        .addStringOption(option => 
            option
                .setName('command')
                .setDescription('الأمر المطلوب')
                .setRequired(true)
                .addChoices(
                    { name: 'clear', value: 'clear' },
                    { name: 'lock', value: 'lock' },
                    { name: 'unlock', value: 'unlock' },
                    { name: 'hide', value: 'hide' },
                    { name: 'unhide', value: 'unhide' },
                    { name: 'server', value: 'server' },
                    { name: 'come', value: 'come' },
                    { name: 'tax', value: 'tax' },
                    { name: 'say', value: 'say' },
                    { name: 'ban', value: 'ban' },
                    { name: 'unban', value: 'unban' },
                    { name: 'kick', value: 'kick' }, 
                    { name: 'تقييم', value: 'rate' },
                    { name: 'user', value: 'user' },
                    { name: 'avatar', value: 'avatar' },
                    { name: 'banner', value: 'banner' },
                    { name: 'nickname', value: 'nickname' },
                    { name: 'role', value: 'role' } // دعم role
                )
        )
        .addStringOption(option => 
            option
                .setName('shortcut')
                .setDescription('الاختصار')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const command = interaction.options.getString('command');
            const shortcut = interaction.options.getString('shortcut');

            // لو الأمر role، نخزن زي باقي الأوامر ونظهر طريقة الاستخدام
            if (command === "role") {
                await shortcutDB.set(`${command}_cmd_${interaction.guild.id}`, shortcut);

                return interaction.reply({
                    content:
`✅ **تم تحديد اختصار للرول بنجاح: \`${shortcut}\`**

**طريقة الاستخدام:**
\`\`\`
${shortcut} @user @role   <- استخدم منشن
${shortcut} userID roleID <- أو استخدم الـ ID
\`\`\``
                });
            }

            // باقي الأوامر تخزن كـ string عادي
            await shortcutDB.set(`${command}_cmd_${interaction.guild.id}`, shortcut);

            return interaction.reply({ 
                content: `✅ **تم تحديد اختصار للأمر \`${command}\` بنجاح: \`${shortcut}\`**` 
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `❌ حدث خطأ ما، حاول مرة أخرى.`, ephemeral: true });
        }
    }
};
