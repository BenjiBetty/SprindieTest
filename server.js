const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const app = express();
const jquery = require('jquery');
const multer = require('multer');
const path = require('path');
const Song = require('./models/song');


//CONTROLLERS
const adminUser = require('./controllers/admin');

//ROUTES
const adminRoutes = require('./routes/adminRoutes')
app.use('/', adminRoutes)

app.get('/musics', function(request, response) {
    const Song = require('./models/song');
    Song.all(function(songs) {
        response.render('songsview', { songs: songs })
    })
})


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


////////////////////////////////////////////////////////////////////CRUD
app.post('/musics', (request, response) => {
    let req = request.body;
    if (req.newtitle === undefined || req.newtitle === '' || req.newband === undefined || req.newband === '' || req.newurl === undefined || req.newurl === '') {
        request.flash('error', "Vous n'avez pas rempli tous les champs, réessayez")
        response.redirect('/add')
    } else {
        Song.create(req.newtitle, req.newband, req.newurl, function() {
            request.flash('success', "Votre musique est publiée")
            response.redirect('/musics')
        })
    }
    response.render('songsview')
})

//UPDATE
app.post('/musics', function(request, response) {
    let req = request.params
    Song.update(req.id, function(songs) {
        response.render('updatesong', { songs: songs })
        response.redirect('/musics')
    })
})

//DELETE
app.post('/musics/delete/:id', (request, response) => {
    let req = request.params
    Song.delete(req.id, function() {
        request.flash('success', "Votre musique est supprimée")
        response.redirect('/musics')
    })
})



/////////////////////////////////////////////////////////////FINCRUD

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
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
        } else if (req.file === undefined) {
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