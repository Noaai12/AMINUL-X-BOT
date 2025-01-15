module.exports = {
  config: {
    name: "daily",
    version: "1.0",
    author: "Nama Anda",
    description: "Klaim hadiah harian",
    category: "Economy",
    guide: "!daily"
  },
onStart: async ({ api, event, args, usersData }) => {
  const waktu = moment().tz("Asia/Jakarta").format("DD/MM/YYYY");
  const data = await usersData.get(event.senderID);
  
  if (data.data.lastDaily === waktu) {
    api.sendMessage("Anda sudah klaim hadiah hari ini!", event.threadID);
    return;
  }
  
  const pilihan = ["Yen", "EXP"];
  const pesan = "Pilih hadiah harian:\n1. Yen\n2. EXP";
  
  api.sendMessage({ body: pesan }, (err, info) => {
    global.GoatBot.onReply.set(info.messageID, {
      commandName: "daily",
      messageID: info.messageID,
      senderID: event.senderID
    });
  }, event.threadID);
},
onReply: async ({ event, message, Reply, usersData }) => {
  const { senderID } = event;
  const { senderID: originalSenderID } = Reply;
  
  if (senderID !== originalSenderID) return;
  
  const pilih = event.body;
  const waktu = moment().tz("Asia/Jakarta").format("DD/MM/YYYY");
  const data = await usersData.get(event.senderID);
  
  if (pilih.toLowerCase() === "yen") {
    await usersData.set(event.senderID, {
      money: data.money + 15,
      data: { ...data.data, lastDaily: waktu }
    });
    message.unsend(Reply.messageID);
    api.sendMessage("Selamat! Anda mendapatkan 15 Yen.", event.threadID);
  } else if (pilih.toLowerCase() === "exp") {
    await usersData.set(event.senderID, {
      exp: data.exp + 15,
      data: { ...data.data, lastDaily: waktu }
    });
    message.unsend(Reply.messageID);
    api.sendMessage("Selamat! Anda mendapatkan 15 EXP.", event.threadID);
  } else {
    message.reply("Pilihan tidak valid!");
  }
}
