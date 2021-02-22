exports.run = async (fun, opt, soc) => {
  fun.playerPrompt(soc, opt.cmd)
};

exports.config = {
  enabled: true,
  name: "setplayerskin",
  view: "SetPlayerSkin",
  params: ["steamid", "skinid"]
};
