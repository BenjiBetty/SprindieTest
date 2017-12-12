let express = require('express')
let app = express()

//MY EXPORTS
let newsong = require('./addSong')

//MY ROUTES
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.get('/', function(request, response) {
    response.render('index')
})
app.get('/add', function(request, response) {
    response.render('addsongs')
})
app.get('/musics', function(request, response) {
    response.render('songs')
})
app.use(function(request, response, next) {
    if (typeof(request.session.songslist) == 'undefined') {
        request.session.songslist = [];
    }
    next();
})
app.post('/add', function(request, response) {
    if (request.body.newsong != '') {
        request.songslist.push(request.body.newsong);
    }
    response.redirect('/musics');
})




//START THE SERVER
app.listen(8080);