const express = require("express");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

// Load env vars - Path is needed as we have made config file in a special location rather than root folder.
dotenv.config({ path: "./config/config.env" });

const app = express();

app.listen(PORT, (req, res) => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
