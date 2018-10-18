// user_controller.js 
const db = require("../db");

exports.user_details_get = function(req, res) {
    var user_id = req.params.user_id;
    var values = [user_id];
    db.query(
        `SELECT username, avatar, point, g.type AS gender, address,phone, description, birthday
        FROM public.user u
        LEFT JOIN gender g
        ON u.gender_id = g.id
        WHERE u.id = ($1)`, 
        values,
        (err, data) => {
          try {
            res.json(data.rows[0]);
          } catch (e) {
            console.log(e);
            res.status(400).send("Data is not available");
          }
        }
      );
   
};

exports.user_summary_get = function(req, res) {
    var user_id = req.params.user_id;
    var values = [user_id];
    db.query(
        `SELECT avatar, username, point, r.name 
        AS role FROM public.user u 
        INNER JOIN user_role r 
        ON u.role_id = r.id 
        WHERE u.id = $1`,
        values,
        (err, data) => {
          try {
            res.json(data.rows[0]);
          } catch (e) {
            console.log(e);
            res.status(400).send("Data is not available");
          }
        }
      );
   
};

// Delete User Account
exports.user_delete = function(req, res) {
  if (!req.isAuthenticated()) {
    // guest cannot delete account
    res.status(403).send({"message":"Guest cannot delete user account"});
  } 
  else if (req.session.passport.user.role == "Admin"){
    deleteAccount(req, res);
  } else if (req.session.passport.user.role == "User" && req.session.passport.user.username == req.params.username){
    // Moderator is not allowed to delete user account
    // Role User. 
    // Only the owner can delete!
    deleteAccount(req, res);
  } else {
    res.status(403).send({"message":"You cannot delete this user account"});
  }
};

// Update User Account - Only Owner can do!
exports.user_update = function(req, res) {
  if (!req.isAuthenticated()) {
    // guest cannot update threads
    res.status(403).send({"message":"Guest cannot update user account"});
  } 
  else /* if (req.session.passport.user.role == "User") */{ //&& req.session.passport.user.username == req.params.username){
    // Moderator is not allowed to update user account
    // Role User. 
    // Only the owner can update!
    updateAccount(req, res);
  } 
/*     else {
    res.status(403).send({"message":"You cannot update this user account"});
  } */
};


// Modify user role - Admin only
exports.user_modify_role = function(req, res) {
  if (req.isAuthenticated() && req.session.passport.user.role == "Admin") {
    let role = req.body.role;
    var role_id;
    switch (role) {
      case 'Admin':
        role_id = '1';
        break;
      case 'Moderator':
        role_id = '2';
        break;
      case 'User':
        role_id = '3';
        break;
      default:
        role_id = '0';
    }
    if (role_id ==0) {
      res.status(400).send({"message":"Role doest not exists"});
    } else {
      let username = req.body.username;
      // Must check if username really exists!
      db.query(`UPDATE public.user SET role_id=$2 WHERE username=$1`, [username, role_id], function(err, result){
        if (err) res.status(400).send({"Message":"Error occured during modifying user role"});
        else res.status(200).send({"Message":"Modify user role successfully"});
      });      
    }
  } else {
    res.status(403).send({"message":"You are not authourized to modify role of any users"});
  }
}


function deleteAccount(req, res) {
  var username = req.params.username;
  db.query(
    `
    DELETE FROM public.user where username= $1;
    `,
    [username],
    (err) => {
      if (err) {
        res.status(400).send({"message":"Error occured during deletion"});
      } else {
        res.status(200).send({"message":"Delete user successfully"});
      }
    }
  );
}

function updateAccount(req, res) {
  var id = req.session.passport.user.id;
  let gender_id = req.body.gender == "Male"? "1":"2";
  console.log(req.body);
  console.log(gender_id); 
  db.query(
    `
    UPDATE public.user SET avatar = $1, 
                           gender_id = $2, 
                           address=$3, 
                           phone=$4, 
                           description=$5, 
                           birthday=$6, 
                           email=$7
      WHERE public.user.id = $8;
    `,
    [req.body.avatar, gender_id, req.body.address, req.body.phone, req.body.description, req.body.birthday, req.body.email, id],
    (err) => {
      if (err) {
        console.log(err);
        res.status(400).send({"message":"Error occured during update account"});
      } else {
        res.status(200).send({"message":"Update user successfully"});
      }
    }
  );
}

exports.billboard = function(req, res) {
  db.query(
    `SELECT id,username,point FROM public.user ORDER BY point DESC LIMIT 3`,
    (err, data) => {
      try {
         res.json(data.rows);
      } catch (e) {
        console.log(e);
        res.status(400).send("Data is not available");
      }
    }
  );
};