let session = require('express-session')
let bodyParser = require('body-parser')
let mysql = require('mysql')
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let express = require('express') //Framework node
let app = express()

//DATABASE
let connection = mysql.createConnection({
    //Properties...
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
});
connection.connect(function(error) {
    //callback
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connected')
    }
})

// MOTEUR DE TEMPLATES
app.set('view engine', 'ejs')

// MIDDLEWARE
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
    console.log(request.session)
})
app.get('/musics', function(request, response) {
    response.render('songs') //On affiche la page songs.ejs qui est le template de la liste de morceaux
    connection.query('SELECT * FROM databaseName', function(error, rows, fields) {
        if (!!error) {
            console.log('Error in the query')
        } else {
            console.log('SUCCESS!\n')
            console.log(rows)
        }

    })
})

app.post('/musics', (request, response) => {
    if (request.body.newtitle === undefined || request.body.newtitle === '' || request.body.newband === undefined || request.body.newband === '' || request.body.newurl === undefined || request.body.newurl === '') {
        request.flash('error', "Vous n'avez pas rempli tous les champs, réessayez")
        response.redirect('/add')
    }
})

// app.post('/add', urlencodedParser, function(request, response) {
//     if (request.body.newtitle != '') {
//         request.songslist.push(request.body.newtitle);
//     }
//     if (request.body.newband != '') {
//         request.songslist.push(request.body.newband);
//     }
//     if (request.body.newurl != '') {
//         request.songslist.push(request.body.newurl);
//     }
//     response.redirect('/musics');
//     console.log(request)
// })

// START THE SERVER
app.listen(8080);