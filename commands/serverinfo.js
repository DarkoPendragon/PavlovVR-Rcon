exports.run = async (fun, opt, soc) => {
  fun.commandHandler(soc, 'ServerInfo').then(async (res) => {
    info = JSON.parse(res)
    console.log(`\n--- ${info.ServerInfo.ServerName} ---\nMapLabel: ${info.ServerInfo.MapLabel}\nGamemode: ${info.ServerInfo.GameMode}\nRoundState: ${info.ServerInfo.RoundState}\nPlayerCount: ${info.ServerInfo.PlayerCount}\n--- ${info.ServerInfo.ServerName} ---\n`);
    fun.commandPrompt(soc)
  })
};

exports.config = {
  enabled: true,
  name: "serverinfo",
  view: "ServerInfo",
  params: ['steamid']
};
