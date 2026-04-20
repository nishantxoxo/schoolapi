const express = require("express");
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/", schoolRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));