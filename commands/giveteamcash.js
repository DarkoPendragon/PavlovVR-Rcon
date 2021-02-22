exports.run = async (fun, opt, soc) => {
  team = await fun.teamPrompt()
  cashAmt = await fun.textPrompt('int', true)
  if (cashAmt) {
    fun.commandHandler(soc, `GiveTeamCash ${team} ${cashAmt}`)
    fun.commandPrompt(soc)
  } else {
    console.log('Not a Int / Steam 64 ID!')
    fun.commandPrompt(soc)
  }
};

exports.config = {
  enabled: true,
  name: "giveteamcash",
  view: "GiveTeamCash",
  params: ["steamid", "CashAmt"]
};
