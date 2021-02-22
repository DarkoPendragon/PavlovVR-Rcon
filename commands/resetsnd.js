exports.run = async (fun, opt, soc) => {
  fun.commandHandler(soc, `ResetSND`)
  fun.commandPrompt(soc)
};

exports.config = {
  enabled: true,
  name: "resetsnd",
  view: "ResetSND",
  params: []
};
