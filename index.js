const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");
const accountSid = "ACb5372861a5287c06e6b0b9119fad7621";
const authToken = "9c89007f1ef9fec4c3810ad0e098d1d7";

const storage = require("node-persist");

// const redis = require("redis");

// const client = redis.createClient();

// client.on("connect", function () {
//     console.log("Connection Successful!!");
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cureofine",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

app.get("/about", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=1;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/privacy", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=3;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/term", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=4;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/return", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=5;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/faq", (req, res) => {
  connection.query(
    "SELECT `content` FROM `static_page` WHERE id=6;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/contact", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var phone = req.body.phone;
  var subject = req.body.subject;

  var sql = `INSERT INTO contact_us (Name, Email, Details, mobile, subject, status, entry_time) VALUES ("${name}", "${email}", "${message}", "${phone}", "${subject}", "New", NOW())`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    //   req.flash('success', 'Data added successfully!');
  });
});

app.post("/enquiry", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var phone = req.body.phone;
  var address = req.body.address;
  var city = req.body.city;

  var sql = `INSERT INTO business_enq (Name, Email, mobile, message, city, address, entry_time) VALUES ("${name}", "${email}", "${phone}", "${message}", "${city}", "${address}", NOW())`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
  });
});

app.post("/signup", async (req, res) => {
  const phoneNumber = parseInt(req.body.phone);

  const otp = Math.floor(100000 + Math.random() * 900000);

  const twilio = require("twilio")(accountSid, authToken);
  await twilio.messages.create({
    to: `+91 ${phoneNumber}`,
    from: +16178418324,
    body: `Your OTP is: ${otp}`,
  });

  const user = { phoneNumber, otp };
  console.log(user);

  await storage.init(/* options ... */);
  await storage.setItem("user", user);

  res.json({ message: "OTP sent successfully" });
  console.log("message sent successfully")

});

app.post("/verify", async (req, res) => {
  const otp = req.body.otp;
  console.log("otp", otp);
  const user = await storage.getItem("user");
  console.log(user);

  if (!user.otp) {
    console.log("not found");
    return res.status(400).json({ message: "User not found" });
   
  }

  if (otp === user.otp) {
    console.log("otp verification successful");
    res.json({ message: "OTP verification successful" });
    const sql = `INSERT INTO signup (phone, otp) VALUES ('${user.phoneNumber}','${user.otp}')`;

    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.json({ message: "User registered successfully" });
      console.log("User registered successfully");
    });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.listen(port, () => {
  console.log("server is running");
});
