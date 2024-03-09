const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const { Markup } = require('telegraf');
const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const token = '7113276394:AAH7RbMcHQlLYOjcwmg2APk1HXoPOCV37t0';
const bot = new TelegramBot(token, {polling: true});
const adminId = '1891941853'; // ID admin, ganti dengan id akun mu
const premiumUserDB = './premiumUsers.json';


// Fungsi untuk memeriksa apakah pengguna adalah pengguna premium
function isPremiumUser(userId) {
  // Mengambil data dari file JSON
  const rawData = fs.readFileSync(premiumUserDB);
  const premiumUsers = JSON.parse(rawData);

  if (premiumUsers.includes(userId)) {
    return true; // Pengguna adalah pengguna premium
  } else {
    return false; // Pengguna adalah non-premium
  }
}

bot.onText(/\/getid/, (msg) => {
  const chatId = msg.chat.id;
  const user_id = msg.from.id;
  const usernames = msg.from.username;
  bot.sendMessage(msg.chat.id, `Username: ${usernames}\nUser ID: ${user_id}`)
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 LINK TELE OWNER TESTIOMI 🛒', url: 'https://t.me/IzzulMods' }
          ]
        ]
      }
      parse_mode: "Markdown"
    }
});

bot.onText(/\/clonebot (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const requestedToken = match[1];
    // Lakukan proses cloning bot di sini menggunakan requestedToken
    bot.sendMessage(chatId, 'Proses cloning bot sedang berjalan...');
});

// Load premium users from database
if (fs.existsSync(premiumUserDB)) {
  const data = fs.readFileSync(premiumUserDB);
  premiumUsers = JSON.parse(data);
}

// Function to save premium users to database
const savePremiumUsers = () => {
  fs.writeFileSync(premiumUserDB, JSON.stringify(premiumUsers));
}

// Function to check if user is admin
const isAdmin = (userId) => {
  return userId.toString() === adminId;
}

// Function to add premium user
const addPremiumUser = (userId) => {
  premiumUsers.push(userId);
  savePremiumUsers();
}

// Function to remove premium user
const removePremiumUser = (userId) => {
  const index = premiumUsers.indexOf(userId);
  if (index > -1) {
    premiumUsers.splice(index, 1);
    savePremiumUsers();
  }
}

// Command: /addprem iduser
bot.onText(/\/addprem (.+)/, (msg, match) => {
  const userId = match[1];
  if (isAdmin(msg.from.id)) {
    addPremiumUser(userId);
    bot.sendMessage(msg.chat.id, `User ${userId} has been added to premium users.`);
  } else {
    bot.sendMessage(msg.chat.id, 'Only admin can add premium users.');
  }
});

// Command: /delprem iduser
bot.onText(/\/delprem (.+)/, (msg, match) => {
  const userId = match[1];
  if (isAdmin(msg.from.id)) {
    removePremiumUser(userId);
    bot.sendMessage(msg.chat.id, `User ${userId} has been removed from premium users.`);
  } else {
    bot.sendMessage(msg.chat.id, 'Only admin can remove premium users.');
  }
});

bot.onText(/\/script/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nKlik Link di bawah kalau ingin ambil scriptnya ⬇️\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Link Script Click Di Sini',
                            url: 'https://github.com/IZZUL-MODS/botcrash'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});


// Menampilkan menu bot 
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id; 
  bot.sendMessage(chatId, "USER MENU ⬇️\n" +
    "/start - untuk memulai bot\n" +
    "/getid - untuk mengambil id anda\n" +
    "/rules - Jika Ingin Mengetahui Peraturan Bot ini" +
    "/info - untuk mengetahui informasi tentang bot ini\n" +
    "/owner - Jika Anda Ingin Menghubungi Owner" +
    "/paymentmenu - untuk melihat infromasi pembayaran\n" +
    "/testi - untuk melihat Channel Testiomi Owner\n" +
    "/clear - untuk menghapus chat di bot ini\n" +
    "/cekprem - untuk cek status premium anda\n" +
    "/tutor - cara pake bot crash nya\n" +
    "/crash1 - untuk crash in group/akun telegram orang\n" +
    "/crash2 - untuk crash in group/akun telegram orang\n" +
    "/crash3 - untuk crash in group/akun telegram orang\n" +
    "/crash4 - untuk crash in group/akun telegram orang\n" +
    "/crash5 - untuk crash in group/akun telegram orang\n" +
    "/crash6 - untuk crash in group/akun telegram orang\n" +
    "ADMIN MENU ⬇️\n" +
    "/addprem id - untuk memberikan akses premium kepada seseorang\n" +
    "/delprem id - untuk menghapus akses premium Milik Seseorang\n" +
        "/script - untuk mengambil script bot ini\n" +
    "🔥 *INGIN MEMBELI SC / JADI MURID CRASH HUBUNGI SAYA DI BAWAH👇* 🔥",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔥CONTACT OWNER🔥', url: 'https://t.me/IzzulMods' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id; 
  bot.sendMessage(chatId, "USER MENU ⬇️\n" +
    "/start - untuk memulai bot\n" +
    "/getid - untuk mengambil id anda\n" +
    "/rules - Jika Ingin Mengetahui Peraturan Bot ini" +
    "/info - untuk mengetahui informasi tentang bot ini\n" +
    "/owner - Jika Anda Ingin Menghubungi Owner" +
    "/paymentmenu - untuk melihat infromasi pembayaran\n" +
    "/testi - untuk melihat Channel Testiomi Owner\n" +
    "/clear - untuk menghapus chat di bot ini\n" +
    "/cekprem - untuk cek status premium anda\n" +
    "/tutor - cara pake bot crash nya\n" +
    "/crash1 - untuk crash in group/akun telegram orang\n" +
    "/crash2 - untuk crash in group/akun telegram orang\n" +
    "/crash3 - untuk crash in group/akun telegram orang\n" +
    "/crash4 - untuk crash in group/akun telegram orang\n" +
    "/crash5 - untuk crash in group/akun telegram orang\n" +
    "/crash6 - untuk crash in group/akun telegram orang\n" +
    "ADMIN MENU ⬇️\n" +
    "/addprem id - untuk memberikan akses premium kepada seseorang\n" +
    "/delprem id - untuk menghapus akses premium Milik Seseorang\n" +
        "/script - untuk mengambil script bot ini\n" +
    "🔥 *INGIN MEMBELI SC / JADI MURID CRASH HUBUNGI SAYA DI BAWAH👇* 🔥",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔥CONTACT OWNER🔥', url: 'https://t.me/IzzulMods' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/paymentmenu/, (msg) => {
  const chatId = msg.chat.id; 
  bot.sendMessage(chatId, "USER MENU ⬇️\n" +
            "PAYMENT MENU ⬇️\n" +
        "/qris - untuk melakukan pembayaran melalui qris\n" +
        "/dana - untuk melakukan pembayaran melalui dana\n" +
        "/ovo - untuk melakukan pembayaran melalui ovo\n" +
        "/gopay - untuk melakukan pembayaran melalui gopay\n" +
    "🔥 *INGIN MEMBELI SC / JADI MURID CRASH HUBUNGI SAYA DI BAWAH👇* 🔥",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔥CONTACT OWNER🔥', url: 'https://t.me/IzzulMods' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/dana/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hi Kak, Jika Mau transfer owner saya uang bisa transfer ke nope di bawah\n085815333998\nMasih Ragu Sama owner aku? Cek aja channel testiomi owner aku yang ada di bawah ⬇️",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 LINK CHANNEL TESTIOMI 🛒', url: 'https://t.me/testizzul' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/rules/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Peraturan Bot :\n1. Users diharap tidak melakukan spam saat penggunaan bot.\n2. Users Tidak diperbolehkan memasukkan bot kedalam grup Kecuali Pt owner.\n3.Pt Owner Tidak diperbolehkan menjual script Bot Ini\n\nSyarat Ketentuan Bot :\n1. Bot tidak akan bertanggungjawab atas apapun yang users lakukan terhadap fitur bot.\n\nNote :\n1. Jika ada bug atau error pada fitur bot, saya mohon untuk lapor kepada /owner\n2. Jika ingin donasi bisa langsung saja ketik /paymentmenu",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 LINK CHANNEL TESTIOMI 🛒', url: 'https://t.me/testizzul' },  {
            text: '☎️ OWNER BOT ☎️',
            url: "https://t.me/IzzulMods"
          }, {
            text: '🌐 LINK YOUTUBE OWNER 🌐',
            url: "https://youtube.com/@IZZUL_MAKER?si=7ulbgDyKYzzIbHcl"
            }]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/gopay/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hi Kak, Jika Mau transfer owner saya uang bisa transfer ke nope di bawah\n085815333998\nMasih Ragu Sama owner aku? Cek aja channel testiomi owner aku yang ada di bawah ⬇️",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 LINK CHANNEL TESTIOMI 🛒', url: 'https://t.me/testizzul' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/ovo/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hi Kak, Jika Mau transfer owner saya uang bisa transfer ke nope di bawah\n085815333998\nMasih Ragu Sama owner aku? Cek aja channel testiomi owner aku yang ada di bawah ⬇️",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 LINK CHANNEL TESTIOMI 🛒', url: 'https://t.me/testizzul' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/qris/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Klik link di bawah untuk melihat qris milih owner saya ⬇️",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Click disini', url: 'https://telegra.ph/file/20d70cfde5d8e4c3b1dde.jpg' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

//menu testi 
bot.onText(/\/testi/, (msg) => {
  const chatId = msg.chat.id;

  // Menampilkan chenel
  bot.sendMessage(chatId, "CHANNEL TESTIOMI SAYA ADA DI BAWAH👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❗ CHENEL ❗', url: 'https://t.me/testizzul' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Script : Bot Crash\nOwner : @IzzulMods\nVersion : 1.0\nIf you want to buy source. Contact @IzzulMods');
      });
      
bot.onText(/\/owner/, (msg) => {
  const chatId = msg.chat.id;
  const userttox = msg.from.username;
        bot.sendMessage(chatId, `Hai ${userttox} 👋, Lagi Nyari Owner Ya kak?? Berikut Username Owner ⬇️\n@IzzulMods\n⬆️Di Atas Adalah Owner Bot Ini`);
      });      

// Event handling untuk perintah tutorial pake bot
bot.onText(/\/tutor/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'hai, ' + (msg.from.username || 'Unknown') + ' cara pake bot crash nya lu ketik command di bawah\n1. /crash1\n2. /crash2', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Akses Premium ',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

// Fungsi untuk menyimpan data premiumUsers ke dalam file JSON
function savePremiumUsersToFile(data) {
    fs.writeFile('premiumUsers.json', JSON.stringify(Array.from(data)), 'utf8', (err) => {
        if (err) {
            console.error('Error writing premiumUsers data', err.message);
        }
    });
}

// Inisialisasi bot
const MAX_MESSAGES_BEFORE_CLEAR_PROMPT = 15;
let messageCount = 0;

bot.onText(/\/clear/, (msg) => {
  const chatId = msg.chat.id;

  if (messageCount < MAX_MESSAGES_BEFORE_CLEAR_PROMPT) {
    // Menghapus riwayat obrolan bot dengan pengguna
    bot.deleteMessage(chatId, msg.message_id)
      .then(() => {
        messageCount++;
        bot.sendMessage(chatId, 'Riwayat obrolan Anda telah dihapus.');
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        bot.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam menghapus riwayat obrolan.');
      });
  } else {
    bot.sendMessage(chatId, 'Anda telah menggunakan bot ini sebanyak 15 kali. Mohon bersihkan riwayat chat Anda sendiri untuk melanjutkan penggunaan bot.');
  }
});

//menu crash
bot.onText(/\/crash1/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/IQW49GINvj4&to'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

  bot.onText(/\/crash2/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/IQW49GINvj4'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

bot.onText(/\/crash3/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/397G-2xspg8?si=Ao3Y3fGjHsryGCUU'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

bot.onText(/\/crash4/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/7HWID6_36Bs'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
        } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

bot.onText(/\/crash5/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/g6wlAEBLKIk'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});

bot.onText(/\/crash6/, (msg) => {
    try {
        const data = fs.readFileSync('premiumUsers.json', 'utf8');
        const premiumUsers = new Set(JSON.parse(data)); // Baca data premiumUsers dari file JSON

        if (premiumUsers.has(msg.from.id.toString())) {
            bot.sendMessage(msg.chat.id, 'Virus Crash Akun And Group Telegram 🦠👾\n\n', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Send Virus Crash',
                            url: 'tg://msg?text=https://youtu.be/n6Ma7azQu-Y'
                        }]
                    ]
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, 'hai ' + (msg.from.username || 'Unknown') + '\nmaaf tidak bisa karena kamu belum menjadi user premium, mau jadi user premium?, bisa beli / sewa di saya admin @IzzulMods', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Beli Premium',
                            url: 'https://t.me/IzzulMods'
                        }]
                    ]
                }
            });
        }
    } catch (err) {
        console.error('Error reading premiumUsers data', err.message);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat memeriksa status premium.');
    }
});


// Fungsi untuk memeriksa apakah pengguna adalah pengguna premium
function isPremiumUser(userId) {
  // Mengambil data dari file JSON
  const rawData = fs.readFileSync('premiumUsers.json');
  const premiumUsers = JSON.parse(rawData);

  if (premiumUsers.includes(userId)) {
    return true; // Pengguna adalah pengguna premium
  } else {
    return false; // Pengguna adalah non-premium
  }
}

bot.onText(/\/cekprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const requestedUserId = match[1];

  if (isPremiumUser(requestedUserId)) {
    bot.sendMessage(chatId, 'ID ' + requestedUserId + ' adalah pengguna premium. 🌟🌟🌟');
  } else {
    bot.sendMessage(chatId, 'ID ' + requestedUserId + ' adalah pengguna non-premium. ⭐');
  }
});

  // Jalankan bot
  bot.startPolling()
