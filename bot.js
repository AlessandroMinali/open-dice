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
  if (message.includes("!roll ") || message.includes("!r")) {
    var commands = message.includes("!roll ") ? message.split("!roll")[1].split(',') : message.split("!r")[1].split(',');
    var result;
    var sums = new Array(commands.length).fill(0);;
    var final = [];
    var comments = new Array(commands.length).fill('');
    for(var i = 0; i < commands.length; i++) {
      var rolls = [];
      var c = '';
      while (result = commands[i].match(/\s?([<>\+\-\/\*]?)\s?(\d*d?\d+)(#[\w\s]+)?/)) {
        // comments
        if (result[3]) {
          if (result[1] != undefined && c.length > 0) { c += result[1]; }
          c += result[3].replace(/\s$/, '').slice(1,);
        }

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
        comments[i] = c;
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

    Math.max(...(comments.map(el => el.length))) + 2;
    if (comments.some(el => el.length > 1)) {
      var z = comments.map(function(e, i) { return [e, sums[i]]; });
      var pad = Math.max(...(comments.map(el => el.length))) + 2;
      var list = '';
      for(var i = 0; i < z.length; i++) { list += z[i][0].padStart(pad, ' ') + ': ' + z[i][1] + "\n"; }
      output = output.join(", ") + " Result:\n" + "```\n" + list.toUpperCase() + "```";
    } else {
      output = output.join(", ") + " Result: " + sums.join(', ').toUpperCase();
    }

    bot.sendMessage({
      to: channelID,
      message: output
    });
  }
});