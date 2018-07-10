const { Client } = require("pg");
const db =
  process.env.NODE_ENV === "test" ? "users-app-db-test" : "users-app-db";
// const pg = require("pg");
const client = new Client({
  connectionString: `postgresql://localhost/${db}`
});

client.connect();

module.exports = client;
