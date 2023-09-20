const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Company = require("../models/Company");
const jwt = require("jsonwebtoken");
const {
  registerRules,
  loginRules,
  validation,
  registerCompanyRules,
} = require("../middelwares/validator");

const isAuth = require("../middelwares/passport");

// router.get("/", (req, res) => {
//   res.send("hello");
// });

//REGISTER

router.post("/registeruser", registerRules(), validation, async (req, res) => {
  const { name, lastname, email, password } = req.body;
  try {
    const newUser = new User({ name, lastname, email, password });

    // check if the email exist
    const searchedUser = await User.findOne({ email });
    if (searchedUser) {
      return res.status(400).send({ msg: "email already exist" });
    }

    //hash password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    console.log(hashedPassword);
    newUser.password = hashedPassword;

    //generating a token

    //save the user
    const newUserToken = await newUser.save();
    const payload = {
      _id: newUserToken._id,
      name: newUserToken.name,
    };
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: 100000,
    });
    res
      .status(200)
      .send({ newUserToken, msg: "user saved..", token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).send(" can not save the user...");
  }
});


// register entreprise 
router.post("/registercompany", registerCompanyRules(), validation, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newCompany = new Company({ name, email, password });

    // check if the email exist
    const searchedCompany = await Company.findOne({ email });
    if (searchedCompany) {
      return res.status(400).send({ msg: "email already exist" });
    }

    //hash password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    console.log(hashedPassword);
    newCompany.password = hashedPassword;

    //generating a token

    //save the company
    const newCompanyToken = await newCompany.save();
    const payload = {
      _id: newCompanyToken._id,
      name: newCompanyToken.name,
    };
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: 100000,
    });
    res
      .status(200)
      .send({ newCompanyToken, msg: "company saved..", token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).send(" can not save the company...");
  }
});
//login
router.post("/login", loginRules(), validation, async (req, res) => {
  const { email, password } = req.body;
  var test = ""
  let searchuser= await User.findOne({ email })
  let searchcompany=await Company.findOne({ email })
  if((searchuser)&&(!searchcompany)){
    test="is user"
  }
  else if((!searchuser)&&(searchcompany)){
    test="is company"
  }
  console.log("ahi test",test)
  try {
    // test company or user 
   
    //find if the user exists
    const serchedUC = await User.findOne({ email })||await Company.findOne({ email });
    //find if the email not exist
    if (!serchedUC){
      return res.status(400).send({ msg: "bad Credential" });
    }
    //passwords are equals
    const match = await bcrypt.compare(password, serchedUC.password);
    if (!match){
      return res.status(400).send({ msg: "bad Credential" });
    }
    // create a token user
    const payload = {
      _id: serchedUC.id,
      name: serchedUC.name,
    };
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: 100000,
    });

    //send the user
    res
      .status(200)
      .send({ user: serchedUC, msg: "success", token: `Bearer ${token}`,
      role:`${test}` });
  } 
  catch (error) {
    res.status(500).send({ msg: "cannot find the user" });
  }
});

//get methode
router.get("/current", isAuth(), (req, res) => {
  res.status(200).send({ user: req.user });
});

module.exports = router;
