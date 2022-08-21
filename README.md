# open-dice

Basic rolls via like so `!roll d20` or `!roll d20`

Can add flat modifiers: `!roll d20 + 5` or `!roll d20 + d4`. Operators: `+ - / *`

Can do compares: `!roll 4d4 > 5` or `!roll 4d4 < 5`

Can do multi rolls and keep them separate `!roll 1d2, 2d4, 3d6, 4d8`

Can combine all of the above!

<!-- [Invite](https://discord.com/api/oauth2/authorize?client_id=1010923500443287683&permissions=2048&scope=bot) -->

# Usage

1. Install [node](https://nodejs.org/en/download/)
2. `$ npm install`
3. Create `auth.json` file with contents:
```json
{
  "token": "<YOUR TOKEN HERE>"
}
```
4. `$ node bot.js` or https://stackoverflow.com/a/29042953