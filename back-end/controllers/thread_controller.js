// post_controller.js
const db = require("../db");

function deleteThread(req, res) {
  var query = req.params;
  const text =
    `DELETE FROM thread where id = $1`;
  const values = [query.thread_id];
  db
    .query(text, values, (err)=>{
      if (err) {
        res.status(400).send({"message":"Delete failed!"})
      } else {
        res.status(200).send({"message":"Delete successfully!"});
      }
    })
}

function updateThread(req, res) {
  var query = req.body;
  var query2 = req.params;
  const text =
    `UPDATE thread
    SET title=$2, thumbnail=$3, tag_id=$4
    WHERE id = $1`;
  const values = [
    query2.thread_id,
    query.title,
    query.thumbnail,
    query.tagid
  ];
  db
    .query(text, values, (err) => {
      if (err) {
        res.send({"message":"Update failed!"});
      } else 
      res.send({"message":"Update successfully!"});
    })
}

exports.thread_get_by_id = function(req, res) {
    var id = req.params.thread_id;  
    values = [id];
    db.query(
      `WITH thread_details AS(
          SELECT t.id,t.title,t.thumbnail,tag.name AS tag
          FROM thread t
          LEFT JOIN tag 
          ON t.tag_id = tag.id
          WHERE t.id = $1
          GROUP BY (t.id,t.title,t.thumbnail,tag.name)
      )
      SELECT td.*, string_agg(p.id::character varying, ',') AS child
      FROM thread_details td
      LEFT JOIN post p
      ON td.id = p.threadid
      GROUP BY (td.id,td.title,td.thumbnail,td.tag);`,
      values,
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

exports.thread_create = function(req, res) {
  if (!req.isAuthenticated()) {
    // guest cannot create thread
    res.status(403).send({"message":"Guest cannot create new thread."});
  } else {
    var query = req.body;
    const text =
      `WITH create_thread AS (
        INSERT INTO thread(title,userid,forumid,creation_date,thumbnail,tag_id) 
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING creation_date,userid,id)
        INSERT INTO post(content,creation_date,userid,threadid,pid) 
        SELECT $7,creation_date,userid,id,null FROM create_thread;`;
    const values = [
      query.title,
      req.session.passport.user.id,
      query.forumid,
      query.creation_date,
      query.thumbnail,
      query.tagid,
      query.content
    ];
    db.query(text, values, (err) => {
      if (err) {
        res.status(400).send({"message":"Create failed!"});
      } else {
        res.status(200).send({"message":"Create successfully!"});
      }
    })
  }

};

exports.thread_delete = function(req, res) {
  if (!req.isAuthenticated()) {
    // guest cannot delete threads
    res.status(403).send({"message":"Guest cannot delete thread"});
  } 
  else if (req.session.passport.user.role == "Admin" || req.session.passport.user.role == "Moderator"){
    deleteThread(req, res);
  } else {
    // Role User. 
    // Only the one who created can delete!
    db.query(`SELECT id, userid FROM public.thread WHERE id=$1 AND userid=$2`, 
    [req.params.thread_id, req.session.passport.user.id], (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.status(403).send({"message":"Something went wrong"});
        // res.status(400).send({"message":"error"});
      } else {
          // if query is fine
          if (result.rows.length == 0) {
            // user does not own the post with the given id
            res.status(403).send({"message":"User does not have permission to delete the thread Or Thread does not exist!"});
          } else {
            // user own the post, now he can delete it!
            deleteThread(req, res);
          }
        }
    });
  }
};

exports.thread_update = function(req, res) {
  if (!req.isAuthenticated()) {
    // guest cannot delete threads
    res.status(403).send({"message":"Guest cannot update thread"});
  } 
  else if (req.session.passport.user.role == "Admin" || req.session.passport.user.role == "Moderator"){
    updateThread(req, res);
  } else {
    // Role User. 
    // Only the one who created can delete!
    db.query(`SELECT id, userid FROM public.thread WHERE id=$1 AND userid=$2`, 
    [req.params.thread_id, req.session.passport.user.id], (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.status(403).send({"message":"Something went wrong"});
        // res.status(400).send({"message":"error"});
      } else {
          // if query is fine
          if (result.rows.length == 0) {
            // user does not own the post with the given id
            res.status(403).send({"message":"User does not have permission to delete the thread Or Thread does not exist!"});
          } else {
            // user own the post, now he can delete it!
            updateThread(req, res);
          }
        }
    });
  }
};

exports.thread_search = function(req, res) {
  var text = req.body.text_search;
  console.log(req.params.text_search);
  values = [text.replace(/ +/g,"&").trim()];
  db.query(
    `SELECT tid, t_title
    FROM (SELECT thread.id as tid,
                 thread.title as t_title,
                 setweight(to_tsvector('english', thread.title), 'A') || 
                 setweight(to_tsvector('simple', u.username), 'C') ||
                 setweight(to_tsvector('simple', t.name), 'B') as document
          FROM thread
          JOIN public.user u ON u.id = thread.userid
          JOIN tag t ON t.id = thread.tag_id
          GROUP BY tid, u.id,t.name) t_search
    WHERE t_search.document @@ to_tsquery('english',$1)
    ORDER BY ts_rank(t_search.document, to_tsquery('english',$1)) DESC;`,
    values,
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

