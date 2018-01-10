const express = require('express')
const router = express.Router()


router.get('/', function(request, response) {
    response.render('index') // On affiche la page index.ejs qui est le template de l'accueil
})
router.get('/upload', function(request, response) {
    response.render('upload')
})
router.get('/add', function(request, response) {
    if (request.session.error) {
        response.locals.error = request.session.error
    }
    response.render('addsongs') //On affiche la page addsongs.ejs qui est le template de l'accueil
})


module.exports = router