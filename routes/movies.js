var express = require('express')
var router = express.Router()
var db = require('../lib/db')
const moment = require("moment");

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

//display all bookfilm
router.get("/allBooks", function (req, res, next) {
    db.query("SELECT * FROM books ORDER BY id desc", function (err, rows) {
      if (err) {
        req.flash("error", err);
        res.json({ message: err });
      } else {
        res.json(rows);
      }
    });
});

//book a movie
router.post("/book-movie-users", function (req, res, next) {
    
    let id_user = req.body.id_user;
    let duree = 10;
    let id_movies = req.body.id_movies;
    let etat = "en cours";
    let expiration_duree = moment()
      .add(duree, "minutes")
      .format("YYYY-MM-DD HH:mm");
    let errors = false;
    if (!errors) {
      var form_data = {
        id_user: id_user,
        id_film: id_movies,
        duree: duree,
        etat: etat,
        expiration_duree: expiration_duree,
      };
      console.log(form_data.expiration_duree);
  
      //insert query
      db.query("INSERT INTO books SET ?", form_data, function (err, result) {
        //if (err) throw err
        if (err) {
          res.render("error", { message: err });
        } else {
          res.json(form_data);
        }
      });
    }
});

//show a booked movie by an user

router.get("/book-movie-users/:id/:id_user", function (req, res, next) {
    console.log(req.params.id);
    let id = req.params.id;
    let id_user = req.params.id_user;
    db.query(
      "SELECT books.id_user as id_user ,  books.id as id , books.etat as etat , books.duree as duree , books.expiration_duree as expiration_duree ,  users.username as username, movies.name as name_movies FROM books LEFT JOIN users on books.id_user = users.id  JOIN movies on books.id_movies = movies.id  WHERE books.id = " +
        id +
        "books.id_user=" +
        id_user,
      function (err, rows, fields) {
        if (err) throw err;
  
        if (rows.length <= 0) {
          res.status(401).json({ message: "Books does not exist" });
        } else {
          var expiration_duree = rows[0].expiration_duree;
          var expirate = moment(expiration_duree); //todays date
          var diff = moment().diff(expirate);
          console.log(diff);
          if (diff > 0) {
            let etat = "Terminé";
            var query = db.query(
              "UPDATE books SET etat = ? WHERE id = ?",
              [etat, rows[0].id],
              function (error, results, fields) {
                if (err) throw err;
                res.json({
                  id: rows[0].id,
                  user: rows[0].username,
                  movies: rows[0].name_movies,
                  duree: rows[0].duree,
                  etat: "Terminé",
                  expiration_duree: rows[0].expiration_duree,
                });
              }
            );
          } else {
            res.json({
              id: rows[0].id,
              id_user: rows[0].username,
              movies: rows[0].name_movies,
              duree: rows[0].duree,
              etat: rows[0].etat,
              expiration_duree: rows[0].expiration_duree,
            });
          }
        }
      }
    );
  });

module.exports = router;
