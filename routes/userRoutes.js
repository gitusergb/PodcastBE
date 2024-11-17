const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const router = express.Router()

const avatar = [
    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-93283.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://www.freepik.com/free-psd/3d-illustration-with-online-avatar_171612680.htm#query=avatar&position=26&from_view=keyword&track=ais_hybrid&uuid=9b791d48-7fe7-41a4-9713-a51d072aa1c9",
    "https://img.freepik.com/premium-photo/isolated-businessman-character-avatar-professional-branding_1029469-183667.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid"
]


router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
    }
  });

router.post("/register", async (req, res) => {
    try {
      const { username ,email, password } = req.body;

      const randomAvatar = avatar[Math.floor(Math.random() * avatar.length)];
  
      if (!email || !password || !username) {
        return res.status(400).send({
          success: false,
          message: "Please provide all required fields.",
        });
      }
      // const user = await User.findOne({email});
      const userExists = await User.findOne({email});
      if (userExists) {
        return res.status(400).send({
          success: false,
          message: "The user already exists!",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      
      const newUser = new User({
        email,
        password: hashPwd,
        username, 
        avatar: randomAvatar
      });
      
      await newUser.save();
      res.status(201).send({
        success: true,
        message: "You've successfully signed up, please login now!",
        registeredUser:newUser
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }); 
  
  router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
      const user = await User.findOne({email});
      if (!user) {
        res.send({
          success: false,
          message: "User does not exist. Please register",
        });
      }
  
      bcrypt.compare(password,user.password,(err, result)=>{
        if(result){
          const token = jwt.sign({ userID:user._id,userusername:user.username},
            process.env.key, 
            {expiresIn: "1d",});
          res.status(200).send({success: true,
             msg:'Login successful!',token: token, 
             userId: user._id,username:user.username,email:user.email});
       }else{
          res.status(400).send({ success: false, message:'Invalid email or password' });
       }
      })
    } catch (err) {
      res.status(400).json({ error: err });
    }
  });

  router.post('/logout',async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      res.status(200).send({ msg:'You have successfully logged out!' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
});

  router.get('/:userId', auth, async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = router;