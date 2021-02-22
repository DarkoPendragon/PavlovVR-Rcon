exports.run = async (fun, opt, soc) => {
  fun.playerPrompt(soc, opt.cmd)
};

exports.config = {
  enabled: true,
  name: "inspectplayer",
  view: "InspectPlayer",
  params: ['steamid']
};
