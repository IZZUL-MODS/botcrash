const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const { Markup } = require('telegraf');
const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const token = '7185347645:AAFpeIogrSBzCBd40GQfIrZZrW3BcheNx00';
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

bot.onText(/\/clonebot (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const requestedToken = match[1];

  if (isPremiumUser(userId)) {
    // Lakukan proses cloning bot di sini menggunakan requestedToken
    bot.sendMessage(chatId, 'Proses cloning bot sedang berjalan...');
  } else {
    bot.sendMessage(chatId, 'Maaf, fitur cloning hanya dapat diakses oleh pengguna premium.');
  }
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

// Menampilkan menu bot 
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id; 
  bot.sendMessage(chatId, "USER MENU ⬇️\n" +
    "/start - untuk memulai bot\n" +
    "/testi - untuk melihat Channel Testiomi Owner\n" +
    "/cekprem id - untuk cek status premium Anda\n" +
    "/clear - untuk menghapus chat di bot ini\n" +
    "/tutor - cara pake bot crash nya\n" +
    "/crash1 - untuk crash in group/akun telegram orang\n" +
    "/crash2 - untuk crash in group/akun telegram orang\n" +
    "ADMIN MENU ⬇️\n" +
        "/clonebot - untuk ngeclone bot ini\n" +
        "/addprem - untuk menambahkan akses premium seseorang\n" +
        "/delprem - untuk menghapus akses premium seseorang\n" +
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
  const chatId = msg.chat.id; 
  if (isAdmin(msg.from.id)) {
    addPremiumUser(userId);
  bot.sendMessage(chatId, "Virus Crash Akun And Group Telegram 🦠👾\n\n" +
    "🔥 Klik Tautan Di Bawah 🔥",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👾 SEND VIRUS CRASH 👾', url: 'tg://msg?text=https://youtu.be/IQW49GINvj4&to' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
    );  
} else {
    bot.sendMessage(msg.chat.id, 'Only admin can add premium users.');
  }
});

bot.onText(/\/crash2/, (msg) => {
  const chatId = msg.chat.id; 
  if (isAdmin(msg.from.id)) {
    addPremiumUser(userId);
  bot.sendMessage(chatId, "Virus Crash Akun And Group Telegram 🦠👾\n\n" +
    "🔥 Klik Tautan Di Bawah 🔥",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👾 SEND VIRUS CRASH 👾', url: 'tg://msg?text=https://youtu.be/IQW49GINvj4' }
          ]
        ]
      },
      parse_mode: "Markdown"
    }
  );
} else {
    bot.sendMessage(msg.chat.id, 'Only admin can add premium users.');
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
