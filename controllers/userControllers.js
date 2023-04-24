const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register a user
//@routes POST /api/users/register
//access public
const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password } = req.body
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists")
    }
     //Generate Strong Password
     const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
     if(!passwordRegex.test(password)){
         res.status(400);
         throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.")
     }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username, email, password: hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid")
    }
    res.json({Message: "Register the user"})
    } catch (error) {
        console.log(error)
        next(error)
    }
    
});

//Login user
//@routes POST /api/users/login
//access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const user = await User.findOne({ email });
    //compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
        );
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("Email or Password is not valid")
    }
});

//Current user info
//@routes POST /api/users/current
//access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports = {registerUser, loginUser, currentUser};