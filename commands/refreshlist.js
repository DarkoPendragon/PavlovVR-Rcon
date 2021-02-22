exports.run = async (fun, opt, soc) => {
  console.log(await fun.commandHandler(soc, 'RefreshList'))
  fun.commandPrompt(soc)
};

exports.config = {
  enabled: true,
  name: "refreshlist",
  view: "RefreshList",
  params: []
};
