exports.run = async (fun, opt, soc) => {
  selection = await fun.textPrompt('int', true)
  fun.commandHandler(soc, `SetLimitedAmmoType ${selection}`)
  fun.commandPrompt(soc)
};

exports.config = {
  enabled: true,
  name: "setlimitedammotype",
  view: "SetLimitedAmmoType",
  params: ['number']
};
