var express = require('express')
var router = express.Router()
var db = require('../lib/db')

//display movies page
router.get('/', function(req,res,next){
    db.query('SELECT * FROM movies WHERE status = ' + 0, function(err,rows){
        if (err) {
            res.render('error',{message:err})
        } else {
            res.json(rows)
        }
    })
})

//add a new movie
router.post('/add', function(req,res,next){
    let name = req.body.name;
    let author = req.body.author;
    let date_sortie = req.body.date_sortie;
    let errors = false;

    if (!errors) {
        var form_data = {
            name: name,
            author: author,
            date_sortie: date_sortie
        }

        //insert query
        db.query("INSERT INTO movies SET ?", form_data, function(err, result){
            //if (err) throw err
            if (err) {
                res.render('error',{message: err})
            } else {
                res.json(form_data)
            }
        })
    }
})

//display a movie detail
router.get('/movie/:id', function(req,res,next){
    let id = req.params.id
    db.query("SELECT * FROM movies WHERE id = " + id, function(err,rows,fields){
        if(err) throw err

        //if movies not found
        if(rows.length <= 0){
            //req.flash('error', 'Movie does not exist')
            res.render('error', {message: "Movie does not exist"})
            //if movies found
        }else{
            res.json(rows)
        }
    })
})

//display edit page
router.get('/movie/edit/:id', function(req,res,next){
    let id = req.params.id
    db.query("SELECT * FROM movies WHERE id = " + id, function(err,rows,fields){
        if(err) throw err

        //if movies not found
        if(rows.length <= 0){
            //req.flash('error', 'Movie does not exist')
            res.render('error', {message: "Movie does not exist"})
            //if movies found
        }else{
            res.json({
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author,
                date_sortie: rows[0].date_sortie
            })
        }
    })
})

//update a movie
router.post('/movie/update/(:id)', function(req,res,next){
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let date_sortie = req.body.date_sortie;
    let errors = false;

    if (!errors) {
        var form_data = {
            name: name,
            author: author,
            date_sortie: date_sortie
        }

        //update query
        db.query("UPDATE movies SET ? WHERE id = " + id, form_data, function(err, result){
            //if (err) throw err
            if (err) {
                res.render('error',{message: err})
            } else {
                res.json(form_data)
            }
        })
    }
})

//delete a movie
router.post('movie/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
    let number = 1
    let errors = false;

    if (!errors) {
        db.query("UPDATE movies SET status = ? WHERE id = ?", [number, id], function(err, result){
            //if (err) throw err
            if (err) {
                res.render('error',{message: err})
            } else {
                res.json({
                message:"video supprimée",
                status: 200
            })
            }
        })

    }

})


module.exports = router;
