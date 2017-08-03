var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var boe = []
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    try {
      if (message.substring(0, 1) == '!') {
          var args = message.substring(1).split(' ');
          var cmd = args[0];
          var text, intro, wowhead

          args = args.splice(1);

          switch(cmd) {
              //help functions
              case 'help':
                  text = '!help\n'
                      + '!ark - Yells out arks favorit word\n'
                      + '!bin - If you have to bin someone\n'
                      + '!boe - Show the list of BoE items we have\n'
                      + '!boeadd - add item !boeadd <type> <piece> <ilvl> <wowheadid> <wowheadroll> - example: !boeadd Plate Helm 915 5851861 155845\n'
                      + '!boedelete - !boedelete <row> - example for deleting the second row !boedelete 2 \n'
                      + '!chwazi - !chwazi <numberOfPicks> <name1> ... <nameN> \n'
                  fPrint(channelID, text)
              break;

              // troll message
              case 'ark':
                  text = 'Reeeeeeeeeeeeeee'
                  fPrint(channelID, text)
              break;

              case 'bin':
                  text = ':wastebasket::wastebasket::wastebasket: IN THE BIN :wastebasket::wastebasket::wastebasket:'
                  fPrint(channelID, text)
              break;

              // bind on equip list
              case 'boe':
                if (boe.length > 0) {
                  intro = "BoE's that are still available: \n"
                  text = intro + fPrintArray(boe)
                  fPrint(channelID, text)
                }
                else {
                  text = 'No BoE\'s currently available'
                  fPrint(channelID, text)
                }
              break;

              //Add item to boe list
              case 'boeadd':
                wowhead = 'Type: ' + args[0] + ' - Slot: ' + args[1] + " - ilvl: " + args[2] + " - link: http://www.wowhead.com/item=" + args[3] + "&bonus=" + args[4]
                boe.push(wowhead)
                text = 'BoE added to the list'
                fPrint(channelID,text + '\n' + wowhead)
              break;

              //Delete an item of the boe list
              case 'boedelete':
                boe.splice(parseInt(args[0]-1),1)
                text = 'BoE removed from the list'
                fPrint(channelID, text)
              break;

              //Chwazi - pick X number from a list of Options
              case 'chwazi':
                var pickCount = args[0]
                var options = args.splice(1)
                var choices = []
                if (pickCount > options.length) {
                  text = 'Chwazi - You haven\'t given me enough choices. :wastebasket:'
                  fPrint(channelID, text)
                }
                else {
                  while (pickCount > 0) {
                      var choice = Math.floor(Math.random() * options.length)
                      choices.push(options[choice])
                      pickCount--
                      options.splice(choice,1)
                    }
                    text = 'Chwazi - I have chosen:\n'
                    fPrint(channelID, text + fPrintArray(choices))
                }
              break;

              // Just add any case commands if you want to..
           }
       }
    }
    catch (err){
      fPrint(channelid, err.message)
    }

});

//function to print in the channel the user put the command
function fPrint(intChannel, strText){
  bot.sendMessage({
      to: intChannel,
      message: strText
  });
}

//Print array on different lines
function fPrintArray(mArray){
  var text = ''
  for (i = 0; i < mArray.length; i++) {
    text += mArray[i] + '\n' ;
  };

  return text;
};
