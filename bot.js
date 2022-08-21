#!/usr/bin/env node

var Discord = require('discord.io');
var auth = require('./auth.json');

function log(...msg) {
  console.log(...msg);
}
function error(channelID) {
  bot.sendMessage({
    to: channelID,
    message: 'INVALID'
  });
}

var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

function d(max) {
  return Math.floor(Math.random() * max) + 1;
}

bot.on('ready', function() {
  console.log('Logged in as %s - %s', bot.username, bot.id);
});
bot.on('message', function (user, userID, channelID, message, evt) {
  if (message === "ping") {
    bot.sendMessage({
      to: channelID,
      message: "pong"
    });
  }
  if (message.includes("!roll ")) {
    var commands = message.replace(/\s/g, '').split("!roll")[1].split(',');
    var result;
    var sums = new Array(commands.length).fill(0);;
    var final = [];
    for(var i = 0; i < commands.length; i++) {
      var rolls = [];
      while (result = commands[i].match(/([<>\+\-\/\*]?)(\d*d?\d+)/)) {
        // plain num
        var num = result[2].match(/^\d+$/);
        //roll
        var roll = result[2].match(/^(\d*)d(\d+)$/);
        if (num) {
          sums[i] += (result[1] || '+') + num;
        } else if (roll) {
          var temp = 0;
          var temp_rolls = [];
          var r;
          for(var j = 0; j < (parseInt(roll[1]) || 1); j++) {
            r = d(roll[2]);
            temp_rolls.push(r);
            temp += r;
          }
          rolls.push(temp_rolls);
          sums[i] += (result[1] || '+') + temp;
        } else {
          return error(channelID);
        }
        commands[i] = commands[i].slice(result[0].length);

      }
      final.push(rolls);
      sums[i] = eval(sums[i]);
    }
    if (final.length == 0) { return error(channelID); }

    var output = [];
    for(var i = 0; i < final.length; i++) {
      var str = [];
      for(var j = 0; j < final[i].length; j++) {
        str.push('[' + final[i][j].join(', ') + ']');
      }
      output.push('`' + str.join(', ') + '`');
    }

    bot.sendMessage({
      to: channelID,
      message: output.join(", ") + " Result: " + sums.join(', ').toUpperCase()
    });
  }
});