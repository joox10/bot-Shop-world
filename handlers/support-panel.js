const { ChatInputCommandInteraction , Client , SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const { Database } = require("st.db")
const dd = new Database("/Json-db/Bots/ticketDB.json")
const discordTranscripts = require('discord-html-transcripts');
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client27
     */
module.exports = (client27 , interaction) => {
  client27.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isStringSelectMenu()) {


      if(interaction.customId === "supportPanel"){
          let selected = await dd.get(`${interaction.channel.id}`)
      //    let panelFind = await panels.findOne({guildid:interaction.guild.id , panelId:selected.panelId})
         const Support = dd.get(`TICKET-PANEL_${interaction.channel.id}`).Support;

          if (!interaction.member.roles.cache.has(Support)) return interaction.reply({content:`**لا تمتلك الصلاحية لفعل هذا**` , ephemeral:true})
          
          if(interaction.values[0] === "renameTicket"){
                const modal = new ModalBuilder().setTitle('تغيير اسم التكت').setCustomId('renameTicketSubmitModal');
                const newNameInp = new TextInputBuilder().setCustomId('newNameValue').setLabel('اسم التذكرة الجديد').setStyle(TextInputStyle.Short).setRequired(true);
                const inpRow = new ActionRowBuilder().addComponents(newNameInp);
                modal.addComponents(inpRow);
                await interaction.showModal(modal);
          }else if(interaction.values[0] === "addMemberToTicket"){
              const modal = new ModalBuilder().setTitle('اضافة عضو للتذكرة').setCustomId('addMemberToTicketSubmitModal');
              const memberIdInp = new TextInputBuilder().setCustomId('addMemberToTicketMemberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
              const inpRow = new ActionRowBuilder().addComponents(memberIdInp);
              modal.addComponents(inpRow);
              await interaction.showModal(modal);
          }else if(interaction.values[0] === "removeMemberFromTicket"){
            const modal = new ModalBuilder().setTitle('حذف عضو من التذكرة').setCustomId('removeMemberFromTicketSubmitModal');
            const memberIdInp = new TextInputBuilder().setCustomId('removeMemberFromTicketMemberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
            const inpRow = new ActionRowBuilder().addComponents(memberIdInp);
            modal.addComponents(inpRow);
            await interaction.showModal(modal);
          }else if(interaction.values[0] === "refreshSupportPanel"){
              try {
                return await interaction.update().catch(async() => {return;})
              } catch  {
                return;
              }
          }
          
      }
    }
 
    if(interaction.isModalSubmit()){
        //---------------------- RENAME ----------------------//
        if(interaction.customId == "renameTicketSubmitModal"){
            const newName = interaction.fields.getTextInputValue('newNameValue');
            await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم تغيير الاسم التكت ل \`${newName}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
            await interaction.update().catch(async() => {return;})
            await interaction.channel.setName(newName)
       //---------------------- ADD MEMBER ----------------------//
        }else if(interaction.customId == "addMemberToTicketSubmitModal"){
          const memberId = interaction.fields.getTextInputValue('addMemberToTicketMemberId');
          const theMember = await client27.users.fetch(memberId)
          if(theMember){
            await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم اضافة \`${theMember.username}\` للتذكرة**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
            await interaction.update().catch(async() => {return;})
            await interaction.channel.permissionOverwrites.edit(theMember.id , {
              ViewChannel: true,
              SendMessages: true
            })
          }else{
            await interaction.reply({embeds : [new EmbedBuilder().setColor('Red').setDescription(`**عذرا لم اجد عضوا بهذا الايدي \`${memberId}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})] , ephemeral : true})
            await interaction.update().catch(async() => {return;})
          }
        //---------------------- REMOVE MEMBER ----------------------//
        }else if(interaction.customId == "removeMemberFromTicketSubmitModal"){
          const memberId = interaction.fields.getTextInputValue('removeMemberFromTicketMemberId');
            const theMember = await client27.users.fetch(memberId).catch(() => {return;})
          if(theMember){
            await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم حذف \`${theMember.username}\` من التذكرة**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
            await interaction.update().catch(async() => {return;})
            await interaction.channel.permissionOverwrites.edit(theMember.id , {
              ViewChannel: false,
              SendMessages: false
            })
          }else{
            await interaction.reply({embeds : [new EmbedBuilder().setColor('Red').setDescription(`**عذرا لم اجد عضوا بهذا الايدي \`${memberId}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})] , ephemeral : true})
            await interaction.update().catch(async() => {return;})
          }
        }
    }
  }
  )}