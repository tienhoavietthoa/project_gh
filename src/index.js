const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

require('./models/associations');
// Register Handlebars helpers
const handlebarsHelpers = require('./config/hbsHelpers');

// Set up view engine
app.engine('hbs', engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
    defaultLayout: 'main',
    helpers: handlebarsHelpers.helpers,
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
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(methodOverride('_method'));
// Thêm ở đây
const fakePayment = require('./routes/fakePayment');
app.use(fakePayment);

const chatboxRouter = require('./routes/client/chat');
app.use(chatboxRouter);

// Routes
const indexRouter = require('./routes/index');
const clientAuthRouter = require('./routes/client/auth');
app.use('/', indexRouter);
app.use('/auth', clientAuthRouter);

//const chatboxRouter = require('./client/chatbox');
//app.use('/', chatboxRouter); // hoặc '/api' nếu bạn dùng tiền tố


// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.post('/api/chat', (req, res) => {
  const message = req.body.message;
  res.send(`Bot nhận: ${message}`);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});