const { Client } = require("pg");

// const pg = require("pg");
const client = new Client({
  connectionString: "postgresql://localhost/users-app-db"
});

client.connect();

module.exports = client;
