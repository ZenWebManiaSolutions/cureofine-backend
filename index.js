const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.port || 3306;
const bodyParser = require("body-parser");
const accountSid = "ACb5372861a5287c06e6b0b9119fad7621";
const authToken = "c6e6762c6d7ec95553f9603006c1d67b";
const storage = require("node-persist");
const cors= require('cors');
app.use(cors())



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const connection = mysql.createConnection({
host: "localhost",
  user: "mclinpll_cureofine",
  password: "BRLN,GC4*WXT",
  database: "mclinpll_cureofine_db",
  
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});


app.get("/", (req, res) => {
res.send("hello")
  console.log("helloo")
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
  const phoneNumber =req.body.phone;

  const otp = Math.floor(100000 + Math.random() * 900000);

  const twilio = require("twilio")(accountSid, authToken);
  await twilio.messages.create({
    to: `+91 ${phoneNumber}`,
    from: +16178418324,
    body: `Your OTP is: ${otp}`,
  })
  .then(()=>res.json({ message: "Valid Number"}))
  .catch(()=>res.json({message: "Invalid Number"}))

  const user = { phoneNumber, otp };
  console.log(user);

  await storage.init();
  await storage.setItem("user", user);

  
  console.log("otp sent successfully")

});


app.post("/verify", async (req, res) => {
  const otp = req.body.otp;
  console.log("otp", otp);
  const user = await storage.getItem("user");
  console.log(user);

  if (!user) {
    console.log("not found");
    return res.status(400).json({ message: "User not found" });
  }

  if (otp == user.otp) {
    console.log("otp verification successful");

    var sql = "INSERT INTO signup (phone, otp, entry_time) VALUES (?, ?, NOW())";
    connection.query(sql, [user.phoneNumber, user.otp], (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
        res.status(500).json({ message: "Database error" });
      } else {
        console.log("User registered successfully");
        res.json({ message: "OTP verification successful" });
          storage.clear();
      }
    });
  } else {
    console.log("Invalid OTP");
    res.status(400).json({ message: "Invalid OTP" });
  }


});




app.get("/presence", (req, res) => {
  connection.query(
    "SELECT * FROM `our_presence`;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(results)
       return res.json(results);
      }
    }
  );
});



app.get("/banner", (req, res) => {
  connection.query(
    "SELECT `id`, `image` FROM `banner`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/state", (req, res) => {
  connection.query(
    "SELECT `id`, `State` FROM `state` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/city", (req, res) => {
  connection.query(
    "SELECT `id`, `name` FROM `manage_district` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/brand", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `logo`,  `status` FROM `brand` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/products", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `duration`, `price`, `offer_price`, `image`, `details` FROM `physiotherapy`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/surgery", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `description` FROM `scategory`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/specialization", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `image` FROM `specialization` ",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/staticText", (req, res) => {
  connection.query(
    "SELECT `page_menu`, `content` FROM `static_page` WHERE id=2;",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/contactInfo", (req, res) => {
  connection.query(
    "SELECT  `email`,  `mobile_2`, `office_hour` FROM `website_data`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.listen(port, () => {
  console.log("server is running");
});
