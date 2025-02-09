class NewController {
    //[GET] /news
    index(req, res){
        res.render('new');
    }
    //[Get] / new/ :slug
    show(req, res){
        res.send('NEW Detail')
    }
}
// 
module.exports = new NewController;