
const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt");

const User = require('../data/models/User');
const authenticateUser = require("../middlewares/authenticateUser");

router
.get("/", (req, res) => {
  res.render('./user/index');
})
.get("/login", (req, res) => {
  res.render('./user/login');
})
.get("/register", (req, res) => {
  res.render("./user/register");
})

.get("/home", authenticateUser, (req, res) => {
    res.render('./home', { user: req.session.user });
  })

  // route for serving post request  
  .post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      res.send("invalid username or password");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("invalid useranme or password");
      return;
    }

    // else he\s logged in
    req.session.user = {
      email,
    };

    res.redirect('./home');
  })
  
  .post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ username, email, password: hashedPassword });

    latestUser
      .save()
      .then(() => {
        console.log(latestUser)
        res.send("registered account!");
        return;
      })
      .catch((err) => console.log(err));
  });

//logout
router.get("../user/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("..user/login");
});

//get details, delete and update
// override with POST having ?_method=DELETE
//app.use(methodOverride('_method'))
//TODO:implement delete and update



router.get("/:id", async (req, res) => {
  const id = req.params.id;
 console.log(id)  

  try {
    const userdetails = await User.findById({_id: id})
     //.lean()

    res.render('./user/details', {
      userdetails,
    })
    console.log(userdetails)
  } catch (err) {
    console.error(err)
    
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
 console.log(id)
  try {
    const usertoremove = await User.findByIdAndDelete(id)    
    console.log(`user with id ${usertoremove} deleted..!!`)  
    const message = 'user deleted siccessfully!!'
    console.log(message)  
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }

  //res.send('delete' + id)
   
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id) 
  const usertoupdate = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password    
  } 
 
   try {
     const userdetails = await User.findByIdAndUpdate(id, usertoupdate)
      
     res.redirect('/')
     console.log(userdetails)
   } catch (err) {
     console.error(err)
     
   }
 });
 


module.exports = router