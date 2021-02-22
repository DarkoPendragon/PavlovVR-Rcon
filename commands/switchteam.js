exports.run = async (fun, opt, soc) => {
  let team = await fun.teamPrompt()
  fun.playerPrompt(soc, opt.cmd, team)
};

exports.config = {
  enabled: true,
  name: "switchteam",
  view: "SwitchTeam",
  params: ["steamid", "teamid"]
};
