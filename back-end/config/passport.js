// config/passport.js

// load db module
const db = require("../db");
// load strategies
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
module.exports = function(passport) {
  /* **********************************************************************/
  // passport session setup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize sers out of session
  /* **********************************************************************/

  // serialize the user for a session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    // console.log("deserialze user for login");
    var values = [id];
    //const user = users[0].id === id ? users[0] : false;
    db.query(
      "select u.id, u.username, u.password from public.user u where u.username=$1",
      values,
      (err, user) => {
        if (err) {
          return done(err);
        }
        done(null, user);
      }
    );
  });

  passport.use(
    "signin",
    new LocalStrategy(function(username, password, done) {
      // console.log("authenticate user");
      var values = [username];
      // console.log(values);
      // promise
      db.query(
        `select u.id, u.username, u.password , ur.name as role
        from public.user u
        JOIN public.role_permission r ON u.role_id = r.id
        JOIN public.user_role ur ON ur.id = r.id
        where u.username= $1;
        `,
        values
      )
        .then(res => {
          var user = res.rows[0];          
          if (user === undefined) {
            return done(null, false, { message: "Incorrect username." });
          }
          // if (password != user.password) {
          //   return done(null, false, { message: "Incorrect password." });
          // }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          // if successful
          return done(null, user);
        })
        .catch(e => console.error(e.stack));
    })
  );

  // strategy to signup new user
  passport.use(
    "signup",
    new LocalStrategy({ passReqToCallback : true},function(req, username, password,  done) {
      
      
      // set up default value;
      var avatar = ".\front-enddesignSketchImagesdefault avatar.png";
      var role_id = 3;
      var point = 0;
      var creation_date = new Date();
      //also need to store password in hash

      const saltRounds = 10;
      let hashpassword = bcrypt.hashSync(password, saltRounds);
      var params_1 = [
        username,
        hashpassword,
        avatar,
        role_id,
        point,
        creation_date,
        req.body.email
      ];
      console.log(req.body.email);
      var params_2 = [username];

      // promise
      db.query(
        "select u.id, u.username from public.user u where u.username=$1;",
        params_2
      )
        .then(res => {
          if (res.rows[0] != null) {
            // console.log('err');
            //return done(null, false, { message: "Username already exists." });
            return done(null, false, req.flash( "Username already exists."));
          } else {
            // if Username is available, we can create new account
            db.query(
              `INSERT INTO public.user (username, password, avatar, role_id, point, creation_date, email) 
                          VALUES ($1, $2, $3, $4, $5, $6, $7) 
                          RETURNING public.user.id;
              `,
              params_1
            )
              .then(res => {console.log(res.rows[0].id); return done(null, res.rows[0]);})
              .catch(e => console.error(e.stack));
            
          }
        })
        .catch(e => console.error(e.stack));            
    })
  );
};
