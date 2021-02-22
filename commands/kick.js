exports.run = async (fun, opt, soc) => {
  fun.playerPrompt(soc, opt.cmd)
};

exports.config = {
  enabled: true,
  name: "kick",
  view: "Kick",
  params: ['steamid']
};
