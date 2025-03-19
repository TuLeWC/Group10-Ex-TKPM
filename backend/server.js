require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./utils/logger");

const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const programRoutes = require("./routes/programRoutes");
const studentStatusRoutes = require("./routes/studentStatusRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info("Connected to MongoDB"))
.catch(error => logger.error("MongoDB connection error: ", error));

app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/student-statuses", studentStatusRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
