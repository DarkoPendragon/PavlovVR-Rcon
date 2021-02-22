exports.run = async (fun, opt, soc) => {
  gamemode = await fun.gmPrompt()
  console.log('Enter MapID | Example: UGC1668673188')
  mapId = await fun.textPrompt('string', true)
  if (mapId) {
    console.log(fun.commandHandler(soc, `SwitchMap ${mapId} ${gamemode}`))
    fun.commandPrompt(soc)
  } else {
    console.log('Something went wrong.')
    fun.commandPrompt(soc)
  }
};

exports.config = {
  enabled: true,
  name: "switchmap",
  view: "SwitchMap",
  params: ["map", "mode"]
};
