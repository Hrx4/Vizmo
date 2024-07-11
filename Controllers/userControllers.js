const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dbCollection = require('../firebaseConfigs');

//register user
const signupUser = asyncHandler(async(req , res) => {
    const {authorName , password} = req.body;
    try {
        if(!authorName || !password){
            return res.status(404).json({
                message: "All fields mandatory"
              });
        }
        const userAvailable = await dbCollection.collection('User').where('authorName' , '==' , authorName).get();
        console.log('====================================');
        console.log(userAvailable.docs.map((it)=>it.data()));
        console.log('====================================');
        if(!userAvailable.empty){
            return res.status(400).json({
                message: "User already exist",
              });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password , 10);
        console.log(`hashed password : ${hashedPassword}`);
        const user =await dbCollection.collection('User').add({
            authorName, 
            password: hashedPassword,
        })
        return res.status(201).json((await user.get()).data());
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return res.status(500).json({
            message: "Sign Up failed",
            err: error,
          });
    }
})


//login user
const loginUser = asyncHandler(async(req , res) => {
    const {authorName, password} = req.body;

    if(!authorName || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await dbCollection.collection('User').where('authorName' , '==' , authorName).get();
    let currentUser =""
    if(!userAvailable.empty ) currentUser= userAvailable.docs[0].data()
    
    if(!userAvailable.empty && (await bcrypt.compare(password , currentUser.password ))){
        const accessToken = jwt.sign({
            user: {
                authorName: currentUser.authorName,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "100m"}
        );
        return res.status(200).json({accessToken})
    }
    else{
        res.status(401)
        throw new Error("authorName or password is not valid")
    }

})


module.exports = {signupUser , loginUser } 
