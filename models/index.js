const mongoose = require("mongoose");
const dbConfig = require("../config/db.config.js");

const db = {};
db.mongoose = mongoose;

(async () => {
  try {
    console.log(dbConfig.URL);
    await db.mongoose.connect(dbConfig.URL);
    console.log("Connected to the database!");
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
})();

db.User = require("./users.model.js")(mongoose);
db.UserAchievements = require("./userachievements.model.js")(mongoose);
db.Tip = require("./tips.model.js")(mongoose);
db.TipCategory = require("./tipcategories.model.js")(mongoose);
db.Task = require("./tasks.model.js")(mongoose);
db.Bill = require("./bills.model.js")(mongoose);
db.FavoriteTip = require("./favoritetip.model.js")(mongoose);
db.Streaks = require("./streaks.model.js")(mongoose);
db.Mascot = require("./mascots.model.js")(mongoose);
db.CategoryTask = require("./categorytasks.model.js")(mongoose);
db.Achievements = require("./achievements.model.js")(mongoose);

module.exports = db;
