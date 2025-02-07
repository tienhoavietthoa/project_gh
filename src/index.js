var path = require('path');
const express = require('express');
const { engine } = require('express-handlebars'); 
const app = express();
const port = 3000;

//xử lý static file
app.use(express.static(path.join(__dirname, 'public')));
// Template engine
app.engine('hbs', engine({
   extname: '.hbs'
})); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


// Định nghĩa tuyến đường
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/new', (req, res) => {
  res.render('new');
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
