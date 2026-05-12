require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES
// --------------------
const systemRoutes = require("./routes/systemRoutes");

app.use("/api", systemRoutes);

// --------------------
// DEFAULT ROUTE
// --------------------
app.get("/", (req, res) => {
  res.send("Recharge Backend Running ✅");
});

// --------------------
// SERVER START
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
