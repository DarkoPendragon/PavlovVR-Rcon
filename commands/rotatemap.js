exports.run = async (fun, opt, soc) => {
  console.log(await fun.commandHandler(soc, 'RotateMap'))
  fun.commandPrompt(soc)
};

exports.config = {
  enabled: true,
  name: "rotatemap",
  view: "RotateMap",
  params: []
};
