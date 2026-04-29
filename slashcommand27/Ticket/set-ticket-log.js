const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const shortcutDB = new Database("/Json-db/Bots/ticketDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-ticket-log')
        .setDescription('تحديد روم اللوغ')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('اللوغ المطلوب')
                .setRequired(true)
                .addChoices(
                    { name: 'Log', value: 'log' },
                    { name: 'Transcripte', value: 'transcripte' }
                )
        )
        .addChannelOption(option =>
            option
                .setName('room')
                .setDescription('اختر الروم')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const command = interaction.options.getString('type');
            const room = interaction.options.getChannel('room');

            if (!command || !room || !room.id) {
                return interaction.reply({ content: "الروم الذي اخترته غير موجود", ephemeral: true });
            }

            let key;
            if (command === 'log') {
                key = `LogsRoom_${interaction.guild.id}`;
            } else if (command === 'transcripte') {
                key = `TransRoom_${interaction.guild.id}`;
            } else {
                return interaction.reply({ content: "هناك خطأ", ephemeral: true });
            }

            await shortcutDB.set(key, room.id);

            return interaction.reply({ content: `**تم تحديد الروم <#${room.id}> بنجاح .**` });
        } catch (error) {
            console.error("Error setting log ticket in the database:", error);
            return interaction.reply({ content: `حدث خطأ ما، حاول مرة أخرى.`, ephemeral: true });
        }
    }
};
