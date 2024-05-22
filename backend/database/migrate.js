const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Database connection
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

console.log('Connecting to MongoDB:', dbUri);
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
  console.log('Connected to MongoDB');

  const modelsPath = path.resolve(__dirname, '../models');
  const modelFiles = fs.readdirSync(modelsPath);

  for (const file of modelFiles) {
    const model = require(path.join(modelsPath, file));
    console.log(`Model loaded: ${file}`);
    try {
      await model.createCollection();
      console.log(`Collection created for: ${file}`);
    } catch (error) {
      console.error(`Error creating collection for ${file}:`, error);
    }
  }

  console.log('Migration completed');
  
  // Close the connection after setup
  mongoose.connection.close();
});