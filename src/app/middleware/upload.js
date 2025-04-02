const multer = require('multer');
const path = require('path');

// Cấu hình Multer để lưu file vào thư mục public/img/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/img/')); // Đường dẫn thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
  }
});

const upload = multer({ storage: storage });

module.exports = upload;