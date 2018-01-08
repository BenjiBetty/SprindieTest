const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const app = express();
const jquery = require('jquery');
const multer = require('multer');
const path = require('path');
const db = require('./models/song');
// MOTEUR DE TEMPLATES
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('./public')) //On définit le dossier contenant les fichiers statiques
app.use('/jquery', express.static(__dirname + './node_modules/jquery/dist/'));
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
app.get('/upload', function(request, response) {
    response.render('upload')
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CRUD
app.post('/musics', (request, response) => {
    let req = request.body;
    if (req.newtitle === undefined || req.newtitle === '' || req.newband === undefined || req.newband === '' || req.newurl === undefined || req.newurl === '') {
        request.flash('error', "Vous n'avez pas rempli tous les champs, réessayez")
        response.redirect('/add')
        console.log('music')
    } else {
        let Song = require('./models/song')
        Song.create(req.newtitle, req.newband, req.newurl, function() {
            request.flash('success', "Votre musique est publiée")
            response.redirect('/musics')
        })
    }
})

app.post('/musics/delete/:id', (request, response) => {
    let Song = require('./models/song')
    let req = request.params

    Song.delete(req.id, function() {
        request.flash('success', "Votre musique est supprimée")
        response.redirect('/musics')
    })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////FINCRUD

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
}).single('music');

app.post('/add', upload, (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('upload', {
                msg: err
            });
        } else if (req.file == undefined) {
            res.render('upload', {
                msg: 'Error: No File Selected!'
            });
        } else {
            let musicPath = req.file.path;
            res.render('addsongs', {
                msg: 'File Uploaded!',
                file: `uploads/${musicPath}`
            });
            console.log(musicPath)
        }
    });
});

// START THE SERVER
let port = 8080
app.listen(port, () => console.log(`Server started on port ${port}`));