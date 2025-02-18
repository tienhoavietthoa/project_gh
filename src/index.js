const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Thiết lập view engine
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'hbs'); 
app.set('views', path.join(__dirname, 'resources', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});