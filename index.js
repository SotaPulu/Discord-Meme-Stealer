const Discord = require("discord.js-selfbot-v13");
//const { ActivityTypes } = require("discord.js-selfbot-v13/typings/enums");
const config = require("./config.json")
const client = new Discord.Client({
    autoRedeemNitro: true,
    checkUpdate: false
});


console.clear();
console.log("Connecting...");

client.on("ready", () => {
    console.log(`Connected!\nLogged In As: [${client.user.username + "#" + client.user.discriminator}]`);
    client.user.setActivity("Breaking TOS xd", {type: "COMPETING"})
    console.time("sessionLenghtInMs");
})

client.on("rateLimit", ratelimit =>{
    console.error(`/!\ RATELIMITED!!! KILLING PROCESS. info: ${ratelimit}`)
    process.kill();
})


client.on("messageCreate", message =>{
    
    if(!config.victimChannels.includes(message.channelId)) return;
    //console.log("passed check #1")
    if(message.attachments.size <= 0) return;
    //console.log("passed check #2")
    if(message.member.user.id == client.user.id) return;
    //console.log("passed check #3")

    let attachmentSizeCheck = 0;
    message.attachments.forEach(attachment => {
        attachmentSizeCheck += attachment.size;
    })
    if(attachmentSizeCheck > 8000000)
    {
        attachmentSizeCheck = 0;
        return;
    }
    attachmentSizeCheck = 0;
    //console.log("passed check #4")

    

    console.log(`Candidate Found! [in: ${message.guild.name}], [user: ${message.member.user.username + "#" + message.member.user.discriminator}], [message: ${message.content}], [attachment: [url: ${message.attachments.first().url}, name: ${message.attachments.first().name}, type: ${message.attachments.first().contentType}]]`)

    //send that bitch

    try {
        config.postingChannels.forEach(channelID =>{
            client.channels
            .fetch(channelID)
            .then(channel =>{
                console.log(`posting meme in channel: ${channel.name}`)
                channel.sendTyping()
                channel.send({
                    content: `**posted by: ** \`${message.member.user.username + "#" + message.member.user.discriminator}\`, **in: ** \`${message.guild.name}\` \n ${message.content}`,
                    files: message.attachments
                })
            })
        })
        
    } catch (error) {console.log(`[ERROR] ${error}`)}

    try {
        config.postingDMS.forEach(dmID =>{
            client.users
            .fetch(dmID)
            .then(dm =>{
                console.log(`posting meme in dm: ${dm.username + "#" + dm.discriminator}`)
                dm.send({
                    content: `**posted by: ** \`${message.member.user.username + "#" + message.member.user.discriminator}\`, **in: ** \`${message.guild.name}\` \n ${message.content}`,
                    files: message.attachments
                })
            })
        })
        
    } catch (error) {console.log(`[ERROR] ${error}`)}
    


    console.log("\n");


})

client.on("messageReactionAdd", async (reaction, user) => {
    if(config.postingChannels.includes(reaction.message.channelId) && reaction.emoji.name == config.favEmoji)
    {
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        config.favChannels.forEach(channelID =>{
            client.channels
            .fetch(channelID)
            .then(channel =>{
                console.log(`posting meme in channel: ${channel.name} \n *Approved by:* \`${reaction.users} \``)
                channel.sendTyping()
                channel.send({
                    content: `${reaction.message.content}` + "\n *Approved by: *" + " `" + user.username + "#" + user.discriminator + "`",
                    files: reaction.message.attachments
                })
            })
        })
    }

    if(reaction.emoji.name == config.delEmoji && config.postingChannels.includes(reaction.message.channelId)) {
        console.log("\nUnfunny meme. Deleting...\n");
        reaction.message.delete();
    }
    
})

client.login(config.token);