// post_controller.js
const db = require("../db");

exports.subforum_get = function(req, res) {    
  db.query(
    `WITH forum_details AS(
	SELECT f.id, f.title, f.description, string_agg(sf.id::character varying, ',') AS child,
	CASE WHEN ff.userid IS NULL THEN false
	ELSE true
        END AS user_following_state
	FROM forum f
	LEFT JOIN forum sf
	ON f.id = sf.pid
	LEFT JOIN forum_followers ff
	ON f.id = ff.forumid AND ff.userid = 2
	WHERE f.pid = 1
	GROUP BY (f.id, f.title, f.description,ff.userid)
), forum_withtype AS(
SELECT fd.*,COUNT(ff.userid) AS followers,
CASE WHEN fd.child IS NULL THEN 1
		ELSE 0 
        END AS type  
	FROM forum_details fd
	LEFT JOIN forum_followers ff
	ON fd.id = ff.forumid
	GROUP BY (fd.id,fd.title,fd.description,fd.child,fd.user_following_state)
)
SELECT ft.id, ft.title, ft.description, ft.user_following_state, ft.followers,ft.type,
	CASE WHEN ft.type = 0 THEN ft.child
	ELSE string_agg(t.id::character varying, ',')
	END AS child
FROM forum_withtype ft
LEFT JOIN thread t
ON ft.id = t.forumid
GROUP BY (ft.id,ft.title,ft.description,ft.user_following_state,ft.followers,ft.type,ft.child);`,
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

exports.subsubforum_get = function(req, res) {
    var subsubforum_id = req.params.subforum_id;
    var values = [subsubforum_id];    
    db.query(
      `WITH forum_details AS(
	SELECT f.id, f.title, f.description, string_agg(sf.id::character varying, ',') AS child,
	CASE WHEN ff.userid IS NULL THEN false
	ELSE true
        END AS user_following_state
	FROM forum f
	LEFT JOIN forum sf
	ON f.id = sf.pid
	LEFT JOIN forum_followers ff
	ON f.id = ff.forumid AND ff.userid = 2
	WHERE f.id = $1
	GROUP BY (f.id, f.title, f.description,ff.userid)
), forum_withtype AS(
SELECT fd.*,COUNT(ff.userid) AS followers,
CASE WHEN fd.child IS NULL THEN 1
		ELSE 0 
        END AS type  
	FROM forum_details fd
	LEFT JOIN forum_followers ff
	ON fd.id = ff.forumid
	GROUP BY (fd.id,fd.title,fd.description,fd.child,fd.user_following_state)
)
SELECT ft.id, ft.title, ft.description, ft.user_following_state, ft.followers,ft.type,
	CASE WHEN ft.type = 0 THEN ft.child
	ELSE string_agg(t.id::character varying, ',')
	END AS child
FROM forum_withtype ft
LEFT JOIN thread t
ON ft.id = t.forumid
GROUP BY (ft.id,ft.title,ft.description,ft.user_following_state,ft.followers,ft.type,ft.child);`,
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