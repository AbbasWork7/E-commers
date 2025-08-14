import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123123@Abbas',
  database: 'pocketangaadi'
});

(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Connected to MySQL database successfully!");
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  }
})();
