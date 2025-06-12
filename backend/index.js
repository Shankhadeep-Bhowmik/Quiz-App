const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve HTML/CSS/JS

mongoose.connect('mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
