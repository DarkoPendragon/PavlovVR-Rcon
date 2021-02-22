const inquirer = require('inquirer');
const net = require('net')
const fs = require('fs');
var servers = JSON.parse(fs.readFileSync("./servers.json"));

var CMDS = [];
async function init() {
  new Promise((res, rej) => {
    return fs.readdir('./commands', (err, files) => err != null ? rej(err) : res(files))
  }).then(async (res) => {
    let files = res.filter(file => file.endsWith('.js'));
    files.forEach((file) => {
      let f = require(`./commands/${file}`)
      if (f.config.enabled) {
        console.log(`Loaded CMD: ${f.config.name} (${file})`);
        CMDS.push({filename: file, run: f.run, view: f.config.view, name: f.config.name, params: f.config.params})
      }
    })
    serverPrompt()
  }).catch((res) => { console.log("Failed to load commands folder: " + res) })
}
init()

function serverPrompt() {
  inquirer.prompt([{
    type: 'list',
    name: 'serverIp',
    message: 'Select a server',
    choices: servers.map(server => server.ip + ':' + server.port),
  }, ]).then(async (selected) => {
    console.info('Connecting to Server:', selected.serverIp);
    if (servers.filter(serv => serv.ip === selected.serverIp.split(':')[0] && serv.port === selected.serverIp.split(':')[1])[0]) {
      activeServer = servers.filter(serv => serv.ip === selected.serverIp.split(':')[0] && serv.port === selected.serverIp.split(':')[1])[0];
      activeSocket = await spinServer(activeServer)
      if (!activeSocket) {
        console.log('Couldn\'t connect\n')
        serverPrompt()
      }
      if (activeSocket) commandPrompt(activeSocket);
    }
  });
}

function commandHandler(socket, command, params) {
  return new Promise(resolve => {
    findCommand = CMDS.filter(cmd => cmd.view === command.split(' ')[0])[0]
    if (findCommand) {
      socket.write(command)
      socket.once('data', function(data) {
        return resolve(data.toString())
      });
    }
  });
}

function runCmd(cmd, functions, options, socket) {
  let c = CMDS.filter(c => c.view == cmd)[0]
  if (!c) return commandPrompt(socket)
  try {
    c.run(functions, options, socket)
  } catch (e) {
    console.log("CMD Failed: " + e)
  }
}

function commandPrompt(socket) {
  inquirer.prompt([{
    type: 'list',
    name: 'command',
    message: 'Commands:',
    pageSize: CMDS.length <= 20 ? CMDS.length : 20,
    choices: CMDS.map(cmd => cmd.view),
  }, ]).then(async (selected) => {
    runCmd(selected.command, FUNCTIONS, {cmd: selected.command}, socket)
  });
}

function playerPrompt(socket, command, option, option2) {
    // find a good delimiter
    if (!socket.playerList.PlayerList) {
        console.log('No players online :(')
        return commandPrompt(socket);
    }
    inquirer.prompt([{
        type: 'list',
        name: 'player',
        message: 'Select a Player',
        choices: socket.playerList.PlayerList.map(player => player.Username + ' | ' + player.UniqueId),
    }, ]).then(async (selected) => {
      steam64Id = selected.player.split(' | ')[1]

      switch (command) {
      case 'kick':
        await commandHandler(socket, 'Kick ' + steam64Id)
        console.log(selected.player.Username + " Was Kicked")
        break;
      case 'kick':
        await commandHandler(socket, 'Kill ' + steam64Id)
        console.log(selected.player.Username + " Was Killed")
        break;
      case 'inspectplayer':
        console.log(await commandHandler(socket, 'InspectPlayer ' + steam64Id))
        break;
      case 'switchteam':
        await commandHandler(socket, `SwitchTeam ${steam64Id} ${option}`)
        break;
      case 'giveitem':
        await commandHandler(socket, `GiveItem ${steam64Id} ${option}`)
        break;
      case 'setplayerskin':
        await commandHandler(socket, `SetPlayerSkin ${steam64Id} ${option}`)
      }
      commandPrompt(socket)
    });
}

function teamPrompt() {
  return new Promise(resolve => {
    inquirer.prompt([{
      type: 'list',
      name: 'team',
      message: 'Select a Team',
      choices: ["Blue Team (Defenders)", "Red Team (Attackers)"],
    }, ]).then(async (selected) => {
      resolve(selected.team)
    });
  });
}

function gmPrompt() {
  return new Promise(resolve => {
    inquirer.prompt([{
      type: 'list',
      name: 'gamemode',
      message: 'Select a Gamemode',
      choices: ["SND", "TDM", "DM", "GUN"],
    }, ]).then(async (selected) => {
      resolve(selected.team)
    });
  });
}


function textPrompt(type, goBack) {
  return new Promise(resolve => {
    inquirer.prompt([{
      message: "",
      type: "input",
      name: "input",
    }, ]).then(async (selected) => {
      if (type === 'int' && selected.input.match(/^\d+$/)) {
        resolve(selected.input)
      } else if (type === 'steamId64' && selected.input.length === 17 && selected.input.match(/^\d+$/)) {
        resolve(selected.input)
      } else if (type === 'string') {
        resolve(selected.input)
      } else {
        resolve(false)
      }
    });
  });
}

function reconnect(socket) {
    //reconnect on loss (max retries)
}

//mark couldnt get authentication method to use json
function spinServer(server) {
  return new Promise(resolve => {
    socket = net.Socket();
    socket.connect(server.port, server.ip, () => {});
    socket.on('error', function(err) {
      console.log(err)
      resolve(false)
    });
    socket.on('data', function(data) {
      if (data.toString().startsWith('Password:')) {
        socket.write(server.password)
        console.log(data.toString())
      }
      if (data.toString().startsWith('Authenticated=1')) {
        console.log('Logged in!');
        (async() => {
          resolve(socket);
          socket.playerList = JSON.parse(await commandHandler(socket, 'RefreshList'))
        })();
        setInterval(async () => {
          socket.playerList = JSON.parse(await commandHandler(socket, 'RefreshList'))
        }, 60000);
      }
      if (data.toString().startsWith('Authenticated=0')) {
        console.log('Login wrong!');
      }
    });
  });
}
const FUNCTIONS = {serverPrompt, commandHandler, commandPrompt, playerPrompt, teamPrompt, gmPrompt, textPrompt, reconnect, spinServer}

process.on("UnhandledPromiseRejectionWarning", e => {
  console.log(e + "\n")
  inquirer.prompt([{
    message: "Unhandled Rejection Warning: Restart server or exit?",
    type: 'list',
    name: 'choice',
    choices: ["Restart", "Exit"],
  }, ]).then(async (selected) => {
    if (selected.choice == "Restart") serverPrompt()
    else if (selected.choice == "CommandHandler") process.exit()
  })
})
.on("uncaughtException", e => {
  console.log(e)
  inquirer.prompt([{
    message: "Unhandled Exception: Restart server or exit?",
    type: 'list',
    name: 'choice',
    choices: ["Restart", "Exit"],
  }, ]).then(async (selected) => {
    if (selected.choice == "Restart") serverPrompt()
    else if (selected.choice == "CommandHandler") process.exit()
  })
})
.on("unhandledRejection", e => {
  console.log(e)
  inquirer.prompt([{
    message: "Unhandled Rejection: Restart server or exit?",
    type: 'list',
    name: 'choice',
    choices: ["Restart", "Exit"],
  }, ]).then(async (selected) => {
    if (selected.choice == "Restart") serverPrompt()
    else if (selected.choice == "CommandHandler") process.exit()
  })
})
