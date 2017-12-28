let session = require('express-session');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let express = require('express');
let app = express();
let jquery = require('jquery');
let multer  = require('multer');
let upload = multer({ dest: 'public/uploads/' });
let path = require('path');
let db = require('./models/song');
    // MOTEUR DE TEMPLATES
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public')) //On définit le dossier contenant les fichiers statiques
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))

// MY ROUTES
app.get('/', function(request, response) {
    response.render('index') // On affiche la page index.ejs qui est le template de l'accueil
})
app.get('/add', function(request, response) {
    if (request.session.error) {
        response.locals.error = request.session.error
    }
    response.render('addsongs') //On affiche la page addsongs.ejs qui est le template de l'accueil
})
app.get('/musics', function(request, response) {
    let Song = require('./models/song')
    Song.all(function(songs) {
        response.render('songsview', { songs: songs })
    })
})

//CRUD
app.post('/musics', (request, response) => {
    let req = request.body;
    if (req.newtitle === undefined || req.newtitle === '' || req.newband === undefined || req.newband === '' || req.newurl === undefined || req.newurl === '') {
        request.flash('error', "Vous n'avez pas rempli tous les champs, réessayez")
        response.redirect('/add')
    } else {
        let Song = require('./models/song')
        Song.create(req.newtitle, req.newband, req.newurl, function() {
            request.flash('success', "Votre musique est publiée")
            response.redirect('/musics')
        })
    }
})

// START THE SERVER
app.listen(8080);