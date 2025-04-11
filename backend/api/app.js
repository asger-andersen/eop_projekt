require('dotenv').config({
  path: `${__dirname}/../.env`
})
const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.7:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('/api/transaction', require('./routes/transactionRoute'))
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/company', require('./routes/companyRoute'))

//For development:
app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));

module.exports = app;