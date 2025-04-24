const { model } = require('mongoose');

// First Example
// const winston = require('winston');

// const logger = winston.createLogger(
//   {
//     format: winston.format.json(),      // Morfh twn logs. json
//     transports: [       // Dhlwnw pou thelw na apothikeuontai ta logs. Mporei na einai pollapla shmeia. Px kai vash kai txt files
//       new winston.transports.Console()
//     ]
//   }
// )


// Second example. Write logs to console 

// const { format, createLogger, transports } = require('winston');
// const { combine, timestamp, label, printf } = format;
// const CATEGORY = "Products app logs";

// const customFormat = printf(({message, label, level, timestamp}) => {    // Orizoume emeis pws tha einai h morfh tou munhmatos tou log
//   return `${timestamp} [${label}: ${level}, ${message}]`;
// })

// const logger = createLogger({
//   // level: "info",
//   format : combine(
//     label({label: CATEGORY}),
//     timestamp(),
//     customFormat
//   ),
//   transports: [ new transports.Console() ]
// })

// // For jest tests
// require('dotenv').config(); (an den valoume setupFiles sto jest sto package.json)


// Third example. Write logs to files and/or MongoDB

require('winston-daily-rotate-file'); // gia files

require('winston-mongodb'); // gia mongodb

const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "Products app logs";

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log",      // Onoma tou log arxeioy pou tha dhmiourgei o logger kathe 14 meres (maxFiles)  
  datePattern: "DD-MM-YYYY",
  maxFiles: "14d"
  //maxSize:
});

const logger = createLogger({
  format: combine(
    label({label: "MY LABEL FOR USERS APP"}),
    timestamp({format: "DD-MM-YYY HH:mm:sss"}),
    format.json()
    // prettyPrint()   // Gia na ta deixnei katheta sthn consola 
  ),
  transports: [
    new transports.Console(), // grafei sthn konsola
    fileRotateTransport,  // grafei sto rotate arxeio. Good practice na ginetai rotate.
    new transports.File(    // grafei sto example.log
      {
        filename: "logs/example.log"
      }
    ),
    new transports.File(    // grafei sto exampleWarn ta logs pou einai mexri kai level warn. Vlepe yerarxeia twn level sto windston documentation
      {
        level: "warn",  
        filename: "logs/exampleWarn.log"
      }
    ),
    new transports.MongoDB({  // grafei sth bash
      level: "error",
      db: process.env.MONGODB_URI,
      collection: "server_logs",
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
})


module.exports = logger;