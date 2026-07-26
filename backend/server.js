const express = require("express");
require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const db = require("./models");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const apiRoutes = require("./src/routes");
const adminRoutes = require("./src/routes/adminRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins when credentials is true, relying on the Nginx header.
      // We ensure that when the origin is sent, it is allowed.
      callback(null, true);
    },
    credentials: true,
  }),
);

// --- Routes ---
app.use("/api/v1", apiRoutes);
app.use("/api/admin", adminRoutes);

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
