const jwt = require("jsonwebtoken"); //Import json web token to create and verify authentification tokens
const mysql = require("mysql"); // Import mysql database
const router = require("express").Router(); //Import router
const con = require("../database"); // Import the database
const verifyToken = require("../middlewares/auth"); // Import the auth middleware

var rateLimit = []; // rateLimit of user

// Authentification with email
router.post("/token", (request, response) => {
  let requestSql =
    "SELECT 1 FROM `users` WHERE email = " + mysql.escape(request.query.email); // Get the email we got from the database

  con.query(requestSql, function (error, result) {
    if (error) {
      console.log(error);
    } else {
      // since the email is not available in the database, json response won't be the token
      if (!result.length) {
        response.json({
          message: "This Email is not available in the database",
        });
      }

      // since the email is available in the database, we can create the token
      jwt.sign(
        { email: request.query.email },
        "secretkey",
        { expiresIn: "2h" },
        (e, token) => {
          rateLimit[request.query.email] = { words: 0, date: new Date() };
          response.json({
            token,
          });
        }
      );
    }
  });
});

router.post("/justify", verifyToken, (req, res) => {
  let linelength = 79; // line length of the justified text
  let limitedtext = "";
  res.type("text/plain"); // body content type text/plain
  // verify body content
  if (!req.body) {
    res.send("");
    return 0;
  }
  //verify user rate limits
  if (!verifyUserLimits()) {
    return 0;
  }
  let texttojustify = req.body.replace(/\s\s+/g, " "); // eliminate line break or consecutive spaces

  for (var i = 0; i < texttojustify.length; i++) {
    limitedtext += texttojustify[i];
    if (i == linelength) {
      // break the line if caractere is ' ' or ',' or '.'
      if (
        texttojustify[i] == " " ||
        texttojustify[i] == "," ||
        texttojustify[i] == "."
      ) {
        linelength = i + 1 + 80;
        limitedtext += "\n";
      } else {
        var j = 0;
        // get length of line according to these caracteres (' ','.',',')
        while (
          texttojustify[i] !== " " &&
          texttojustify[i] !== "." &&
          texttojustify[i] !== ","
        ) {
          i = i - 1;
          j++;
        }

        limitedtext = limitedtext.substring(0, limitedtext.length - j) + "\n";
        linelength = i + 80;
      }
    }
  }
  // After setting the limits of the line now it's time to justify it by adding spaces
  res.send(justifyText(limitedtext));

  function verifyUserLimits() {
    if (!rateLimit[req.user.email] || !rateLimit[req.user.email].date) {
      rateLimit[req.user.email] = { words: 0, date: new Date() };
    }

    var today = new Date();
    var lastdaysubmitted = rateLimit[req.user.email].date;
    // check user rate limit date
    var sameDate;
    today.getTime() - lastdaysubmitted.getTime() >= 86400000
      ? (sameDate = false)
      : (sameDate = true);

    if (!sameDate) {
      rateLimit[req.user.email].date = new Date();
      rateLimit[req.user.email].words = 0;
    }

    // inform user that he should pay
    if (rateLimit[req.user.email].words + req.body.length > 80000) {
      res.status(402).json({ message: "402 Payment Required" });
      return false;
    }
    // Update words count
    rateLimit[req.user.email].words =
      rateLimit[req.user.email].words + req.body.length;

    return true;
  }
});

// justify text by adding spaces
function justifyText(limitedtext) {
  maxlengthline = 80;

  var newlines = limitedtext.split(/\n/);

  for (var i = 0; i < newlines.length; i++) {
    var line = newlines[i].trim();

    if (line.length >= maxlengthline) {
      continue;
    }
    var q = 1;
    for (var j = 0; j < line.length; j++) {
      if (line[j] == " " && line.length < maxlengthline) {
        if (j <= line.length - 1) {
          line = line.substring(0, j) + "  " + line.substring(j + 1);
        }
        j = j + q;
      }
      if (j == line.length - 1 && line.length < maxlengthline) {
        j = 0;
        q++;
      }
    }
    newlines[i] = line;
  }
  return newlines.join("\n");
}

module.exports = router;
