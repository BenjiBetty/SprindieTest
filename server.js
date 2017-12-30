let session = require('express-session');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let express = require('express');
let app = express();
let jquery = require('jquery');
let multer  = require('multer');
let path = require('path');
let db = require('./models/song');
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

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('filetoupload');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
  app.post('/musics', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('addsongs', {
          msg: err
        });
      } else if(req.file == undefined){
        res.render('addsongs', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('songsview', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    });
  });

// START THE SERVER
let port = 8080
app.listen(port, () => console.log(`Server started on port ${port}`));