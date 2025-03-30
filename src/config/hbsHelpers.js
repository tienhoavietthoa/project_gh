const handlebars = require('handlebars');

handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
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
});

handlebars.registerHelper('sum', (a, b) => a + b);
handlebars.registerHelper('eq', (a, b) => a == b);
handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.registerHelper('lt', (a, b) => a < b);
handlebars.registerHelper('add', (a, b) => a + b);
handlebars.registerHelper('sub', (a, b) => a - b);
handlebars.registerHelper('range', function (start, end) {
    let result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
});
handlebars.registerHelper('json', (context) => JSON.stringify(context));
handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
});
handlebars.registerHelper('calculateTotal', function (cart) {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
});
handlebars.registerHelper('reduce', function (cart, quantityProp, priceProp) {
    return cart.reduce((total, item) => total + item[quantityProp] * item[priceProp], 0);
});
handlebars.registerHelper('formatCurrency', function (value) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
});

module.exports = handlebars;