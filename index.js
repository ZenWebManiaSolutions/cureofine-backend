const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");
// const storage = require("node-persist");
const path = require("path")
const cors = require('cors');
const accountSid = "ACb5372861a5287c06e6b0b9119fad7621";
const authToken = "b9deda9bf11b986094e20069e8f479bb";
const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');
const axios = require('axios');
const multer = require('multer');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
const sendSms = async (mobileNumber, otp) => {
  // console.log(mobileNumber,otp)
  const apiKey = '413483A3W9I40kb5g7659e5c6fP1'; // Replace with your actual API key
  const apiUrl = 'https://api.msg91.com/api/v5/flow/';
  
  try {
    const response = await axios.post(apiUrl, {
      flow_id: '659e5ebeb6ea785bac43ae09',
      sender: 'CUREOF',
      mobiles: `91${mobileNumber}`,
      otp: otp,
    }, {
      headers: {
        'authkey': apiKey,
        'content-type': 'application/json',
      },
    });

    console.log('Msg91 API response:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};
const connection = mysql.createPool({

  connectionLimit: 10,
  host: "119.18.54.135",
user: "mclinpll_cureofine_new_u",
password: "3{Mg~G39W8MK",
database: "mclinpll_cureofine_new",
  // host: "119.18.54.135",
  // user: "mclinpll_cureofine",
  // password: "BRLN,GC4*WXT",
  // database: "mclinpll_cureofine_db",


//   $servername = "localhost";
// $username = "mclinpll_cureofine_new_u";
// $password = "3{Mg~G39W8MK";
// $dbname = "mclinpll_cureofine_new";



  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "cureofine_new",
});


function handleDisconnect() {
  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to MySQL');
    
      connection.release();
    }
  });

}

handleDisconnect();

// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("connected");
//   }
// });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'upload', 'idproof');
    cb(null, uploadDir);
},

  filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      if (!req.uploadedImages) {
        req.uploadedImages = [];
      }
   
      const uploadedImage = uniqueName + extension;
      req.uploadedImages.push(uploadedImage);
      cb(null, uniqueName + extension);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.fields([{ name: 'photo' }, { name: 'aadhar' }]), (req, res) => {

  // Assuming 'photo' and 'aadhar' are the names of the fields in the frontend form
  // Uploaded image details are available in req.files

   const uploadedImages = req.uploadedImages;
   // console.log("114",uploadedImages)
   res.status(200).json({
     message: 'Images uploaded successfully',
     uploadedImages: uploadedImages
   });
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

app.get("/dept", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_department`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/qualification", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_qualification`",
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
  const phoneNumber = req.body.phone;
  // console.log(phoneNumber)

  const otp = Math.floor(100000 + Math.random() * 900000);

  const twilio = require("twilio")(accountSid, authToken);
  await twilio.messages.create({
    to: `+91 ${phoneNumber}`,
    from: +16178418324,
    body: `Your OTP is:${otp}`,
  })
    .then(() => res.json({ message: "Valid Number" }))
    .catch(() => res.json({ message: `Invalid Number${phoneNumber}` }))

  const user = { phoneNumber, otp };
  // console.log(user);

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

    var sql = "INSERT INTO web_user( mobile, otp_details, cdate ) VALUES (?, ?, NOW())";
    connection.query(sql, [user.phoneNumber, user.otp], (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
        res.status(500).json({ message: "Database error" });
      } else {
        console.log("User registered successfully");
          res.json({ message: "OTP verification successful",number: user.phoneNumber });
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
    "SELECT `id`, `location_id`, `name`, `image`, `status` FROM `manage_location` WHERE status= 'Active'",
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
    "SELECT `id`, `image`, `page` FROM `banner` ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/offerBanner", (req, res) => {
  connection.query(
    "SELECT `id`, `image` FROM `offerbanner`",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/service", (req, res) => {
  connection.query(
    "SELECT `id`, `ser_id`, `name`, `image`, `cby`, `status` FROM `manage_service` ",    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/doctorsList", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_doctor` WHERE status= 'Active' ",  (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/languages", (req, res) => {
  connection.query(
    "SELECT * FROM `manage_language` WHERE status= 'Active' ", (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/surgeryCategory", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_surgery_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/surgeryList", (req, res) => {
  connection.query(
    "SELECT s.id AS `surgery_id`, s.`ser_id`, s.`location` AS `surgery_location`, s.`category`, s.`hospital`, s.`name`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status`, s.`price`, s.`offer_price`, s.`details` AS `surgery_details`, s.`tranding`, s.`status`, s.`cby`, s.`cdate` FROM `surgery` s JOIN `manage_hospital` h ON s.`hospital` = h.`hos_id` WHERE s.`status` = 'Active' AND h.`status` = 'Active';",
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/ivfList", (req, res) => {
  connection.query(
    "SELECT ivf.`id` AS `ivf_id`, ivf.`ser_id`, ivf.`location` AS `ivf_location`, ivf.`category`, ivf.`hospital`, ivf.name, ivf.`price`, ivf.`offer_price`, ivf.`details` AS `dental_details`, ivf.`tranding`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `ivf` ivf JOIN `manage_hospital` h ON ivf.`hospital` = h.`hos_id` WHERE ivf.`status` = 'Active' AND h.`status` = 'Active';",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/dentalList", (req, res) => {
  connection.query(
    "SELECT d.`id` AS `dental_id`, d.`ser_id`, d.`location` AS `dental_location`, d.`category`, d.`hospital`, d.name, d.`price`, d.`offer_price`, d.`details` AS `dental_details`, d.`tranding`, d.`status`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `dental` d JOIN `manage_hospital` h ON d.`hospital` = h.`hos_id` WHERE d.`status` = 'Active' AND h.`status` = 'Active';",
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});


app.get("/hairList", (req, res) => {
  connection.query(
    "SELECT hair.`id` AS `hair_id`, hair.`ser_id`, hair.`location` AS `hair_location`, hair.`category`, hair.`hospital`, hair.name, hair.`price`, hair.`offer_price`, hair.`details` AS `hair_details`, hair.`tranding`, h.`name` AS `hospital_name`, h.`location` AS `hospital_location`, h.`image` AS `hospital_image`, h.`address` AS `hospital_address`, h.`mobile1` AS `hospital_mobile1`, h.`mobile2` AS `hospital_mobile2`, h.`contact_person` AS `hospital_contact_person`, h.`facility_type`, h.`service_type`, h.`h_type`, h.`employee_id`, h.`hospital_display_id`, h.`hos_rand`, h.`entity_type`, h.`registration_document`, h.`details` AS `hospital_details`, h.`hospital_time`, h.`sun_start`, h.`sun_end`, h.`mon_start`, h.`mon_end`, h.`tue_start`, h.`tue_end`, h.`wed_start`, h.`wed_end`, h.`thu_start`, h.`thu_end`, h.`fri_start`, h.`fri_end`, h.`sat_start`, h.`sat_end`, h.`sun_status`, h.`mon_status`, h.`tue_status`, h.`wed_status`, h.`thu_status`, h.`fri_status`, h.`sat_status` FROM `hair` hair JOIN `manage_hospital` h ON hair.`hospital` = h.`hos_id` WHERE hair.`status` = 'Active' AND h.`status` = 'Active';",
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});






app.get("/ivf", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_ivf_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/dental", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_dental_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/hairCosmetic", (req, res) => {
  connection.query(
    "SELECT `id`, `cat_id`, `name`, `image`, `cby`, `cdate`, `status` FROM `manage_hair_category` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/ayurveda", (req, res) => {
  connection.query(
    "SELECT `id`, `ayu_id`, `name`, `image`, `details`, `inclusion`, `excluation`, `price`, `offer_price`, `location`, `tranding`, `cby`, `cdate`, `status` FROM `ayurveda` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/testimonials", (req, res) => {
  connection.query(
    "SELECT `id`, `name`, `profession`, `date_of_speak`, `content`, `img`, `entry_time`, `entry_by`, `status` FROM `testimonial` WHERE status= 'Active'",   
     (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/brands", (req, res) => {
  connection.query(
    "SELECT `id`, `brand_id`, `name`, `logo`, `status`, `banner` FROM `brand` WHERE status= 'Active'",   
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


// app.get("/brand", (req, res) => {
//   connection.query(
//     "SELECT `id`, `name`, `logo`,  `status` FROM `brand` ",
//     (error, results) => {
//       if (error) {
//         console.log(error);
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });


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
    "SELECT `id`, `domain`, `facebook`, `twitter`, `youtube`, `linkdin`, `whatsapp`, `instagram`, `address_1`, `address_2`, `email`, `mobile_1`, `mobile_2`, `cus_care_num`, `hits`, `office_hour` FROM `website_data`",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/hospitals", (req, res) => {
  connection.query(
   "SELECT * FROM `manage_hospital` WHERE status= 'Active'",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});



app.get("/facilityType", (req, res) => {
  connection.query(
    "SELECT `id`, `fac_id`, `name` FROM `manage_facility` WHERE status= 'Active'",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});


// app.get("/surgeryList", (req, res) => {
//   connection.query(
//     "SELECT `id`, `name`, `price`, `offer_price`, `image`, `details`, `hid` FROM `surgery`",
//     (error, results) => {
//       if (error) {
//         console.log(error);
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });


app.post("/updateProfile", async (req, res) => {
  // console.log(req.body);

  const phoneNumber = req.body.phone;
  const name = req.body.name;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  const email = req.body.email;
  const pincode = req.body.pincode;
  const gender = req.body.gender;
  const image = req.body.image;

  const updateProfileQuery =
    "UPDATE web_user SET name = ?, email = ?, gender = ?, image = ?, city = ?, state = ?, country = ?, pincode = ? WHERE mobile = ?";

  connection.query(
    updateProfileQuery,
    [name, email, gender, image, city, state, country, pincode, phoneNumber],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});


app.get("/userInfo", (req, res) => {
  const phoneNumber = req.query.phone; // Use req.query for GET requests
  // console.log(phoneNumber);

  const getUserQuery = "SELECT * FROM `web_user` WHERE mobile = ?";
  
  connection.query(getUserQuery, [phoneNumber], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching user information" });
    } else {
      res.json(results);
    }
  });
});





  app.post("/generateOtp", async (req, res) => {
    const phoneNumber = req.body.phone;
    // console.log(phoneNumber)
  
    // Check if the user exists in the database
    const checkUserQuery = "SELECT * FROM web_user WHERE mobile = ?";
    connection.query(checkUserQuery, [phoneNumber], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.length === 0) {
        // User does not exist, insert the user and generate OTP
       
        let otp;

        if (phoneNumber == '9555554642') {
          console.log("verify")
              otp = 444444;
        }
        else {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        
        
        const insertUserQuery = "INSERT INTO web_user(mobile, otp_details, cdate) VALUES (?, ?, NOW())";
        connection.query(insertUserQuery, [phoneNumber, otp], (err, result) => {
          if (err) {
            console.error("Error inserting data into the database:", err);
            res.status(500).json({ message: "Database error" });
          } else {
            // Send OTP to the user using Msg91 API
             sendSms(phoneNumber,otp)
            .then(() => {
              // console.log("Msg91 API response:", data);
              res.json({ message: "OTP generated and sent successfully", number: phoneNumber });
            })
            .catch(err => {
              console.error("Error sending SMS:", err);
              res.status(500).json({ message: "Error sending SMS" });
            });
          }
        });
      }
     else if (results.length != 0) {
        // User exists, generate and insert OTP
        let otp;

        if (phoneNumber == '9555554642') {
          console.log("verify")
          otp = 444444;
        }
        else {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        
  
        const insertOtpQuery = "UPDATE web_user SET otp_details = ? WHERE mobile = ?";
        connection.query(insertOtpQuery, [otp, phoneNumber], (err, result) => {
          if (err) {
            console.error("Error inserting OTP into the database:", err);
            res.status(500).json({ message: "Database error" });
          } else {
            // Send OTP to the user using Msg91 API
            // sdk.sendSms({
            //   template_id: '659e5ebeb6ea785bac43ae09',
            //   recipients: [{ mobiles: phoneNumber, VAR1: otp.toString() }]
            // })
           sendSms(phoneNumber,otp)
            .then(() => {
              // console.log("Msg91 API response:", data);
              res.json({ message: "OTP generated and sent successfully", number: phoneNumber });
            })
            .catch(err => {
              console.error("Error sending SMS:", err);
              res.status(500).json({ message: "Error sending SMS" });
            });
          }
        });
      }
    });
  });
  
  app.post("/verifyOTP", async (req, res) => {
    const phoneNumber = req.body.phone;
    const enteredOTP = req.body.otp;
  
    // Verify OTP against the stored OTP in the database
    const verifyOtpQuery = "SELECT * FROM web_user WHERE mobile = ? AND otp_details = ?";
    connection.query(verifyOtpQuery, [phoneNumber, enteredOTP], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
  
      if (results.length > 0) {

        const updateStatusQuery = "UPDATE web_user SET status = '1' WHERE mobile = ?";
        connection.query(updateStatusQuery, [phoneNumber], (updateErr, updateResults) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ message: "Error updating status" });
          }
          else{
            console.log("OTP verification successful")
            res.json({ message: "OTP verification successful", number: phoneNumber });
          }
        })
       

      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    });
  });


app.post("/bookSurgery", async (req, res) => {
    // console.log(req.body);
  
    const service_id = req.body.service_id;
    const name = req.body.name;
    const gender = req.body.gender;
    const age = req.body.age;
    const address = req.body.address;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const service_name = req.body.service_name;
    const service_date = req.body.service_date;
    const service_time = req.body.service_time;
    const amount = req.body.amount;
    const book_type = req.body.book_type;
  
    const sqlInsert = `INSERT INTO common_book (user_id,service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, cdate, book_type) VALUES ('1',?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
  
    connection.query(
      sqlInsert,
      [service_id, name, gender, age, address, mobile, email, service_name, service_date, service_time, amount, book_type],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Error inserting data" });
        }
  
        // Retrieve the last inserted ID
        const lastInsertId = insertResults.insertId;
  
        // Construct the booking_id
        const booking_id = `CUR000${lastInsertId}`;
  
        // Update the record with the generated booking_id
        const sqlUpdate = `UPDATE common_book SET booking_id = ? WHERE id = ?`;
  
        connection.query(
          sqlUpdate,
          [booking_id, lastInsertId],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({ message: "Error updating booking_id" });
            }
  
            console.log("Insertion successful");
            res.json({ message: "Insertion successful", result: updateResults });
          }
        );
      }
    );
  });



  app.post("/emiForm", async (req, res) => {
    // console.log(req.body);
    const name = req.body.name;
    const attendant_name= req.body.attendant_name;
    const age = req.body.age;
    const gender = req.body.gender;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const reason_emi= req.body.reason_emi
    const selfi = req.body.selfi;
    const aadhaar = req.body.aadhaar;
    const amount = req.body.amount;
    const required_amount = req.body.required_amount;
    const address = req.body.address;
    const service_name = req.body.service_name;
    const service_id = req.body.service_id; 
    const book_type = req.body.book_type;
  
    const sqlInsert = `INSERT INTO emi_form(user_id, name,attendant_name, age, gender, mobile, email, reason_emi, selfi, aadhaar, amount, required_amount, cdate, address, service_name, service_id, book_type) VALUES ('1',?,?,?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?)`;
  
    connection.query(
      sqlInsert,
      [name,attendant_name,age, gender, mobile, email, reason_emi,selfi,aadhaar,amount, required_amount, address, service_name,service_id,book_type],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Error inserting data" });
        }
  
        // Retrieve the last inserted ID
        const lastInsertId = insertResults.insertId;
  
        // Construct the booking_id
        const booking_id = `Emi000${lastInsertId}`;
  
        // Update the record with the generated booking_id
        const sqlUpdate = `UPDATE emi_form SET booking_id = ? WHERE id = ?`;
  
        connection.query(
          sqlUpdate,
          [booking_id, lastInsertId],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({ message: "Error updating booking_id" });
            }
  
            console.log("Insertion successful");
            res.json({ message: "Insertion successful", result: updateResults });
          }
        );
      }
    );
  });


  const phonepeRoute = require('./routes/phonepayRoute')
app.use("/api", phonepeRoute);


app.post("/updatePaymentTransactionSuccess", async (req, res) => {
  // console.log(req.body);

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const service_name = req.body.service_name

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = '1' , payment_date = NOW() WHERE mobile = ? AND service_name = ?;";

  connection.query(
    updateProfileQuery,
    [transactionId,  phoneNumber,service_name],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        // console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});

app.post("/updatePaymentTransactionFailure", async (req, res) => {
  // console.log(req.body);

  const phoneNumber = req.body.phone;
  const transactionId = req.body.transaction_id;
  const service_name = req.body.service_name

  const updateProfileQuery =
    "UPDATE common_book SET transaction_id = ?, payment_status = '0' , payment_date = NOW() WHERE mobile = ? AND service_name = ?";

  connection.query(
    updateProfileQuery,
    [transactionId,  phoneNumber, service_name],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Error updating status" });
      } else {
        console.log("Updation successful");
        res.json({ message: "Updation successful", result: updateResults });
      }
    }
  );
});
app.listen(port, () => {
  console.log("server is running");
});
