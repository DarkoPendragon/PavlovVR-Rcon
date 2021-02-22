exports.run = async (fun, opt, soc) => {
  console.log(await fun.commandHandler(soc, 'Blacklist'))
  fun.commandPrompt(soc)
};

exports.config = {
  enabled: true,
  name: "blacklist",
  view: "Blacklist",
  params: []
};
