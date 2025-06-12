const { model } = require('mongoose');

require('winston-daily-rotate-file'); 

require('winston-mongodb');

const { format, createLogger, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "Products app logs";

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log",      
  datePattern: "DD-MM-YYYY",
  maxFiles: "14d"
  //maxSize:
});

const logger = createLogger({
  format: combine(
    label({label: "MY LABEL FOR USERS APP"}),
    timestamp({format: "DD-MM-YYY HH:mm:sss"}),
    format.json()
  ),
  transports: [
    new transports.Console(), 
    fileRotateTransport,  
    new transports.File(    
      {
        filename: "logs/example.log"
      }
    ),
    new transports.File(    
      {
        level: "warn",  
        filename: "logs/exampleWarn.log"
      }
    ),
    new transports.MongoDB({  
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
