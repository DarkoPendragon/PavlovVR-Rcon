exports.run = async (fun, opt, soc) => {
  steam64Id = await fun.textPrompt('steamId64', true)
  if (steam64Id) {
    fun.commandHandler(soc, 'Ban ' + steam64Id.toString())
    fun.commandPrompt(soc)
  } else {
    console.log('Not a Int / Steam 64 ID!')
    fun.commandPrompt(soc)
  }
};

exports.config = {
  enabled: true,
  name: "ban",
  view: "Ban",
  params: ['steamid']
};
