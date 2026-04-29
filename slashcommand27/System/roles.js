const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle } = require("discord.js");


module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('للاستعلام عن رتب السيرفر'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return interaction.reply({ content: `**لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });
            }

            let roles = "";
            let names = interaction.guild.roles.cache.map((role) => `${role.name}`);
            let longest = names.reduce(
                (long, str) => Math.max(long, str.length),
                0
            );
            interaction.guild.roles.cache.forEach((role) => {
                roles += `${role.name}${" ".repeat(longest - role.name.length)} : ${role.members.size} members\n`;
            });

            const chunkSizeLimit = 1990; // 2000 - 10 (for the delimiters)

            for (let i = 0; i < roles.length; i += chunkSizeLimit) {
                const chunk = roles.substring(i, i + chunkSizeLimit);
                const messageContent = `\`\`\`js\n${chunk}\n\`\`\``;

                if (i === 0) {
                    await interaction.reply(messageContent);
                } else {
                    await interaction.followUp(messageContent);
                }
            }

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `**لقد حدث خطا اتصل بالمطورين**`, ephemeral: true });
        }
    }
}
