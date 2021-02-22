exports.run = async (fun, opt, soc) => {
  itemName = await fun.textPrompt('string', true)
  fun.playerPrompt(soc, opt.cmd, itemName)
};

exports.config = {
  enabled: true,
  name: "giveitem",
  view: "GiveItem",
  params: ["steamid", "itemid"]
};
