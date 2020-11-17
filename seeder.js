const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamps = require("./models/Bootcamp");
const Course = require("./models/Course");
const { exit } = require("process");

// Connect to the DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import Data into DataBase
const importData = async () => {
  try {
    await Bootcamps.create(bootcamps);
    await Course.create(courses);
    console.log("Data Imported...".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

// Delete Data from DataBase
const deleteData = async () => {
  try {
    await Bootcamps.deleteMany();
    await Course.deleteMany();
    console.log("Data Destroyed...".red.inverse);
  } catch (err) {
    console.log(err);
  }
};

// Based on input we import or delete data
// Eg: node seeder -i then argv[2] is "-i"
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
