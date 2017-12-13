let session = require('cookie-session'); //Gestion de sessions temporaires
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let express = require('express') //Framework node
let app = express()

/* On utilise les sessions */
app.use(session({ secret: 'todotopsecret' }))



//MY ROUTES
app.set('view engine', 'ejs')
app.use(express.static('assets')) //On définit le dossier contenant les fichiers statiques
app.get('/', function(request, response) {
    response.render('index') // On affiche la page index.ejs qui est le template de l'accueil
})
app.get('/add', function(request, response) {
    response.render('addsongs') //On affiche la page addsongs.ejs qui est le template de l'accueil
})
app.get('/musics', function(request, response) {
    response.render('songs') //On affiche la page songs.ejs qui est le template de la liste de morceaux
})

// S'il n'y a pas de songslist dans la session, on en crée une vide sous forme d'array avant la suite
app.use(function(request, response, next) {
    if (typeof(request.session.songslist) == 'undefined') {
        request.session.songslist = [];
    }
    next();
})
app.post('/add', urlencodedParser, function(request, response) {
    if (request.body.newtitle != '') {
        request.songslist.push(request.body.newtitle);
    }
    if (request.body.newband != '') {
        request.songslist.push(request.body.newband);
    }
    if (request.body.newurl != '') {
        request.songslist.push(request.body.newurl);
    }
    response.redirect('/musics');
})

//START THE SERVER
app.listen(8080);