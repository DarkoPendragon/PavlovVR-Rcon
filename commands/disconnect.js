exports.run = async (fun, opt, soc) => {
  console.log('Disconnecting..')
  soc.destroy();
  fun.serverPrompt()
};

exports.config = {
  enabled: true,
  name: "disconnect",
  view: "Disconnect",
  params: []
};
