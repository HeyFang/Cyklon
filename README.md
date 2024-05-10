# Discord bot to display minecraft server stats.

Currently it has /status command which displays stats with an embed:
![embed](./embed.png)


## To run it:
1. Install all dependencies with `npm install` command.
2. Create a `config.json` file and declare following keys:
```json
{
    "token": "bot-token",
    "clientId": "bot-client-id",
    "guildId": "discord-server-id",
    "serverIp": "minecraft-server-ip"
}
```
3. run `node deploy-commands.js`
4. run `nodemon run index.js`
