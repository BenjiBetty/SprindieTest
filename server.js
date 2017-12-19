let session = require('express-session')
let bodyParser = require('body-parser')
let mysql = require('mysql')
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let express = require('express')
let app = express()
let db = require('./models/songsdb')
    // MOTEUR DE TEMPLATES
app.set('view engine', 'ejs')

// MIDDLEWARES
app.use(express.static('assets')) //On définit le dossier contenant les fichiers statiques
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
    Songs.all(function() {
        response.render('songsview', { title: title, band: band, url: url })
    })
})

//CRUD
app.post('/musics', (request, response) => {
    if (request.body.newtitle === undefined || request.body.newtitle === '' || request.body.newband === undefined || request.body.newband === '' || request.body.newurl === undefined || request.body.newurl === '') {
        request.flash('error', "Vous n'avez pas rempli tous les champs, réessayez")
        response.redirect('/add')
    } else {
        let Songs = require('./models/songsdb');
        let req = request.body;
        Songs.create(req.newtitle, req.newband, req.newurl, function() {
            request.flash('success', "Votre musique est publiée")
            response.redirect('/musics')
        })
    }
})

// START THE SERVER
app.listen(8080);