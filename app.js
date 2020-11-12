const express = require("express");
//const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const cookieSession = require("cookie-session");
const moment = require('moment')

const methodOverride = require('method-override')

const connectDB = require("./data/db")
const User = require("./data/models/User");
const userRoutes = require('./routes/userRoutes')

//const authenticateUser = require("./middlewares/authenticateUser");

const app = express();

// mongdb local connection 
connectDB()
app.use(bodyParser.urlencoded({ extended: false })) /
app.use(bodyParser.json())
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.use(express.static("public"));

app.set("view engine", "ejs");

// cookie session
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);

//default home/route
app.get('/', async(req, res) => {
  //const userdata = undefined
  try {
     //TODO: add filter
    const userdata = await User.find()      //where('createdAt').exists(true)
    //console.log(userdata)
    res.render('index', {userdata : userdata, moment: moment} )
  } catch (error) {
    console.log(error)
  }
})



// route for handling user registrations
app.use('/users', userRoutes)


// server config
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
