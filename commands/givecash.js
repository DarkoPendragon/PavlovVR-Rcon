exports.run = async (fun, opt, soc) => {
  cashAmt = await fun.textPrompt('int', true)
  fun.playerPrompt(soc, opt.cmd, cashAmt)
};

exports.config = {
  enabled: true,
  name: "givecash",
  view: "GiveCash",
  params: ["steamid", "CashAmt"]
};
