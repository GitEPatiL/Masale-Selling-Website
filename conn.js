const mysql = require("mysql");
const util = require("util");

let conn;

function handleConnection() {
  conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "oraganic_masale",
  });

  conn.connect((err) => {
    if (err) {
      console.error("❌ Error connecting to MySQL:", err);
      setTimeout(handleConnection, 2000); // Retry after 2 seconds
    } else {
      console.log("✅ Connected to MySQL");
    }
  });

  conn.on("error", (err) => {
    console.error("❌ MySQL Error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("🔁 Reconnecting to DB...");
      handleConnection();
    } else {
      throw err;
    }
  });
}

handleConnection();

// Export promisified query
const exe = (...args) => {
  return new Promise((resolve, reject) => {
    if (!conn) return reject("No DB connection.");
    const query = util.promisify(conn.query).bind(conn);
    query(...args)
      .then(resolve)
      .catch(reject);
  });
};

module.exports = exe;
