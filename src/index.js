const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

// Đăng ký các helper Handlebars
require('./config/hbsHelpers');

// Thiết lập view engine
app.engine('hbs', engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
    defaultLayout: 'main',
    helpers: {
        sum: (a, b) => a + b,  // Định nghĩa helper sum
        eq: (a, b) => a == b,  // Định nghĩa helper eq
        gt: (a, b) => a > b,   // Định nghĩa helper gt
        lt: (a, b) => a < b,   // Định nghĩa helper lt
        add: (a, b) => a + b,  // Định nghĩa helper add
        sub: (a, b) => a - b,  // Định nghĩa helper sub
        range: function(start, end) { // Định nghĩa helper range
            let result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        },
        json: (context) => JSON.stringify(context), // Thêm helper json
        ifCond: function (v1, operator, v2, options) { // Định nghĩa helper ifCond
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,  // Bật truy cập thuộc tính prototype
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
    saveUninitialized: false, // Chỉ lưu session khi có user đăng nhập
    cookie: { secure: false } // Đặt thành true nếu dùng HTTPS
}));
app.use(methodOverride('_method'));

// Routes
const indexRouter = require('./routes/index');
const clientAuthRouter = require('./routes/client/auth');
app.use('/', indexRouter);
app.use('/auth', clientAuthRouter);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});