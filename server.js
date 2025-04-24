const app = require('./app');
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect(process.env.MONGODB_URI)    
  .then(
    () => {
      console.log('Connection to MongoDB established');

      app.listen(port, () => {
        console.log('Up and running on port 3000');
      })
    },
    (err) => {
      console.log('Failed to connect to MongoDB', err);
    }
  )



