const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Database connection
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
  console.log('Connected to MongoDB');

  const newUser = new User({
    firstName: 'Mathis',
    lastName: 'SPORTIELLO',
    email: 'mathis.sportiello@gmail.com',
    password: 'Azerty123/',
    birthDate: new Date(2001, 2, 4),
    activated: true,
    role: 'admin',
    sexe: 'masculin'
  });

  try {
    await newUser.save();
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    mongoose.connection.close();
  }
});


