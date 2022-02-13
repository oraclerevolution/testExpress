var express = require('express');
var router = express.Router();
var db = require('../lib/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//signup

router.post('/signup', function(req, res){
    let email = req.body.email
    let username = req.body.username;
    let password = req.body.password;
    let errors = false;

    if (!errors) {
        var form_data = {
            email: email,
            username: username,
            password: password
        }

        //insert query
        db.query("INSERT INTO users SET ?", form_data, function(err, result){
            //if (err) throw err
            if (err) {
                res.render('error',{message: err})
            } else {
                res.json(form_data)
            }
        })
    }
})


//login
router.post('/auth', function(request, response) {
	
	let username = request.body.username;
	let password = request.body.password;
  let status = 0
	
	if (username && password) {
		db.query('SELECT * FROM users WHERE username = ? AND password = ? AND status = ?', [username, password, status], function(error, results, fields) {
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Redirect to home page
        console.log(results);
				response.json(results)
			} else {
        response.json({
          message: "Incorrect Username and/or Password!",
        })
				response.send('');
			}			
			response.end();
		});
	} else {
    response.json({
      message: "Please enter Username and Password!",
    })
		response.end();
	}
});

//logout
router.get('/logout', function(req,res){
  
})

//update my profile infos

router.post('/profile/update/:id', function(req,res,next){
  
  let id = req.params.id;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let errors = false;

  if (!errors) {
      var form_data = {
          email: email,
          name: username,
          password: password
      }

      //update query
      db.query("UPDATE users SET ? WHERE id = " + id, form_data, function(err, result){
          //if (err) throw err
          if (err) {
              res.render('error',{message: err})
          } else {
              res.json(form_data)
          }
      })
  }
})

//delete an account
router.post('profile/delete/(:id)', function(req, res, next) {

  let id = req.params.id;
  let number = 1
  let errors = false;

  if (!errors) {
      db.query("UPDATE users SET status = ? WHERE id = ?", [number, id], function(err, result){
          //if (err) throw err
          if (err) {
              res.render('error',{message: err})
          } else {
              res.json({
              message:"compte supprimée",
              status: 200
          })
          }
      })
  }

})


module.exports = router;
