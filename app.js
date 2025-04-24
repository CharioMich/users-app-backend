const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({extended:false}));

app.use(express.json());    

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const user = require('./routes/user.routes');       
const userProduct = require('./routes/user.products.routes');
const userAuth = require('./routes/auth.routes');

app.use(cors({      // Cross-Origin Resource Sharing. Allow only specified client to access the backend
  origin: ['http://localhost:8000']
}));

app.use('/api/users', user);       
app.use('/api/user-product', userProduct);
app.use('/api/auth', userAuth);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.options)); // Swagger server
app.use('/', express.static('files'));       

module.exports = app;
