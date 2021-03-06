const { Pool } = require("pg");
const url = require("url");

// Configuration
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");
const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true
};

const pool = new Pool(config); //for database connection

module.exports = {
 rideHubPool: pool
};


module.exports = {
    query: (text, params, callback) => {        
      return pool.query(text, params, callback)
    }

    

  }