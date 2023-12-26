const pg = require('pg')
require('dotenv').config()

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: process.env.PGUSER  , // env var: PGUSER
  database: process.env.PGDATABASE, // env var: PGDATABASE
  password: process.env.PGPASSWORD, // env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: process.env.PGPORT, // env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

const pool = new pg.Pool(config)

async function query (q) {
  const client = await pool.connect()
  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}

const addPosts = async (content) => {
    let query = "INSERT INTO posts (message) values" + "(" + "'" + content + "')"
    return await pool.query(query)
}

const getPosts = async () => {
  const m = await pool.query('SELECT * FROM posts')
  let posting = []
  const messageList = m.rows
  for (let i = 0; i < messageList.length; i++){
      posting.push(messageList[i].message)
  }
  return posting
}






module.exports = {addPosts, getPosts}