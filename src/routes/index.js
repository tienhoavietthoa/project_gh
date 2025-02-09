const newRouter = require('./new');
const siteRouter = require('./site');


function route(app){
    // Định nghĩa tuyến đường
  /*request : chứa thông tin mà ứng dụng gửi lên server
  response : tùy chọn , set up dữ liệu trả về ntn , trả về cái gì
    app.get('/', (req, res) => {
    res.render('home');
  });
  app.get('/new', (req, res) => {
    res.render('new');
  }); */

  app.use('/new' , newRouter);
  app.use('/' , siteRouter);

  /* action -> dispatcher ->function handler
  app.get('/search', (req, res) => {
    //console.log(req.query);  // lấy value truyền qua url
    res.render('search');  //controller tương tác với view */

  }; 
  

module.exports = route;