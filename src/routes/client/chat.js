const express  = require('express'); 
const router = express.Router();
const Product = require('../../models/product');
const Category = require('../../models/category');

router.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).send('Vui lòng nhập câu hỏi.');

    try {  
        const products = await Product.findAll();
        const categories = await Category.findAll();
        const lowerMsg = message.toLowerCase();

        // 1. Danh sách thể loại
        if (
            lowerMsg.includes('thể loại') &&
            (lowerMsg.includes('gì') || lowerMsg.includes('nào') || lowerMsg.includes('có những'))
        ) {
            const categoryNames = categories.map(c => c.name_category);
            return res.send('📖 Các thể loại sách hiện có:\n📚 ' + categoryNames.join(' 📚 '));
        }

        // 2. Danh sách sách theo thể loại
        const matchedCategory = categories.find(c => lowerMsg.includes(c.name_category.toLowerCase()));
        if (matchedCategory) {
            const booksInCategory = products.filter(p => p.id_category === matchedCategory.id_category);
            if (booksInCategory.length > 0) {
                const list = booksInCategory.map(b => `📘 ${b.name_product}`).join('\n');
                return res.send(`📚 Các sách thuộc thể loại "${matchedCategory.name_category}":\n${list}`);
            }
        }

        // 3. Hỏi thông tin theo tên sách
        const book = products.find(p => lowerMsg.includes(p.name_product.toLowerCase()));
        if (book) {
            let response = `📘 ${book.name_product}`;

            if (lowerMsg.includes('giá')) {
                response += ` có giá ${book.price}đ.`;
            }

            if (lowerMsg.includes('năm')) {
                response += ` Xuất bản năm ${book.publisher_year}.`;
            }

            if (lowerMsg.includes('nhà xuất bản') || lowerMsg.includes('xuất bản bởi')) {
                response += ` Nhà xuất bản: ${book.publisher}.`;
            }

            if (lowerMsg.includes('thể loại')) {
                const category = categories.find(c => c.id_category === book.id_category);
                response += ` Thể loại: ${category?.name_category || 'Không rõ'}.`;
            }

            if (response === `📘 ${book.name_product}`) {
                const category = categories.find(c => c.id_category === book.id_category);
                response = `📘 Thông tin về sách "${book.name_product}":\n- Giá: ${book.price}đ\n- Nhà xuất bản: ${book.publisher}\n- Năm xuất bản: ${book.publisher_year}\n- Thể loại: ${category?.name_category || 'Không rõ'}`;
            }

            return res.send(response);
        }

        // 4. So sánh giá nâng cao
        const priceNumbers = message.match(/\d{5,7}/g)?.map(n => parseInt(n));
        if (priceNumbers?.length) {
            let matched = [];

            if (lowerMsg.includes('từ') && lowerMsg.includes('đến') && priceNumbers.length === 2) {
                matched = products.filter(p => p.price >= priceNumbers[0] && p.price <= priceNumbers[1]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} có giá ${p.price}đ`).join('\n');
                    return res.send(`📚 Sách giá từ ${priceNumbers[0]}đ đến ${priceNumbers[1]}đ:\n${list}`);
                } else {
                    return res.send(`❌ Không tìm thấy sách trong khoảng giá ${priceNumbers[0]}đ - ${priceNumbers[1]}đ.`);
                }
            }

            if ((lowerMsg.includes('dưới') || lowerMsg.includes('trở xuống')) && priceNumbers.length >= 1) {
                matched = products.filter(p => p.price <= priceNumbers[0]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} có giá ${p.price}đ`).join('\n');
                    return res.send(`📚 Các sách có giá ${priceNumbers[0]}đ trở xuống:\n${list}`);
                } else {
                    return res.send(`❌ Không có sách nào có giá ${priceNumbers[0]}đ trở xuống.`);
                }
            }

            if ((lowerMsg.includes('trên') || lowerMsg.includes('trở lên')) && priceNumbers.length >= 1) {
                matched = products.filter(p => p.price >= priceNumbers[0]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} có giá ${p.price}đ`).join('\n');
                    return res.send(`📚 Các sách có giá ${priceNumbers[0]}đ trở lên:\n${list}`);
                } else {
                    return res.send(`❌ Không có sách nào có giá ${priceNumbers[0]}đ trở lên.`);
                }
            }
        }

        // 5. So sánh năm xuất bản nâng cao
        const yearMatch = message.match(/(19|20)\d{2}/g);
        const yearNumbers = yearMatch?.map(y => parseInt(y));
        if (yearNumbers?.length) {
            let matched = [];

            if (lowerMsg.includes('từ') && lowerMsg.includes('đến') && yearNumbers.length === 2) {
                matched = products.filter(p => p.publisher_year >= yearNumbers[0] && p.publisher_year <= yearNumbers[1]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} (${p.publisher_year})`).join('\n');
                    return res.send(`📚 Sách xuất bản từ năm ${yearNumbers[0]} đến ${yearNumbers[1]}:\n${list}`);
                } else {
                    return res.send(`❌ Không có sách nào xuất bản từ ${yearNumbers[0]} đến ${yearNumbers[1]}.`);
                }
            }

            if (lowerMsg.includes('sau') && yearNumbers.length >= 1) {
                matched = products.filter(p => p.publisher_year > yearNumbers[0]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} (${p.publisher_year})`).join('\n');
                    return res.send(`📚 Các sách xuất bản sau năm ${yearNumbers[0]}:\n${list}`);
                } else {
                    return res.send(`❌ Không có sách nào xuất bản sau năm ${yearNumbers[0]}.`);
                }
            }

            if (lowerMsg.includes('trước') && yearNumbers.length >= 1) {
                matched = products.filter(p => p.publisher_year < yearNumbers[0]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} (${p.publisher_year})`).join('\n');
                    return res.send(`📚 Các sách xuất bản trước năm ${yearNumbers[0]}:\n${list}`);
                } else {
                    return res.send(`❌ Không có sách nào xuất bản trước năm ${yearNumbers[0]}.`);
                }
            }

            if (yearNumbers.length === 1) {
                matched = products.filter(p => p.publisher_year === yearNumbers[0]);
                if (matched.length > 0) {
                    const list = matched.map(p => `📘 ${p.name_product} (${p.publisher_year})`).join('\n');
                    return res.send(`📚 Các sách xuất bản năm ${yearNumbers[0]}:\n${list}`);
                } else {
                    return res.send(`❌ Không tìm thấy sách xuất bản năm ${yearNumbers[0]}.`);
                }
            }
        }

        res.send('❌ Không tìm thấy sách phù hợp.');
    } catch (err) {
        res.status(500).send("Lỗi server.");
    }
});

module.exports = router;
