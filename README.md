# Summary
A simple CLI Rcon for Pavlov VR with the ability to make custom commands.  
Original repo: https://github.com/vankruptgames/PavlovVR-Rcon  

# Config & Startup
First, edit `server.json` with an array of selected servers. Passwords must be an MD5 hash ([see here](https://www.md5hashgenerator.com/)). Example:
```json
[{
        "ip": "1.1.1.1",
        "port": "9100",
        "password": "098f6bcd4621d373cade4e832627b4f6"
    },
    {
        "ip": "2.2.2.2",
        "port": "8082",
        "password": "098f6bcd4621d373cade4e832627b4f6"
    }
]
```

Then run `npm i` in the directory you put this project in. This installs the packages needed to run.  
This doesn't install NodeJS, which you'll need to run this. You can find that here: https://nodejs.org/en/  

Now run `node init` in the directory of the project and you'll have access you your rcon via cli.  

# Custom Commands
Custom commands can be made by making a file in the commands folder. Commands have to be a `.js` file and follow this format:
```javascript
exports.run = async (functions, options, socket) => {
  // code goes here
  // 'functions' allows for access to all of the functions in init.js
  // 'socket' is the current connected socket
  // 'options' is an object, usually with 'cmd' stating the command name sent
};

exports.config = {
  enabled: true,       // whether or not to add the command on startup
  name: "kick",        // name of the command
  view: "Kick",        // name of the actual, case sensitive, command to send to rcon
  params: ['steamid']  // parameters for the command
};

```
