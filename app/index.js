const express = require("express"); //Import express
const bodyParser = require("body-parser"); // Import body parser to parse content into text or json
const app = express(); //Define an express app
const port = process.env.PORT || 5000; //Define port number to use

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use("/api", require("./routers/routes"));


// display welcome page
app.get('/', (req, res) => {
  res.end(
       "<h1> welcome page: Let's justify the text </h1>"
  );
});

// Make the app listens on port 5000
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
