//imports

const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// User login
module.exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body

  try {

    //Check if user already exists 
    const userExist = await User.findOne({ email: email });

    //first check if userexist in database

    if (userExist) {
      const checkPass = bcrypt.compareSync(password, userExist.password);

      // if exist signin using a generatedToken from jwt, to check if admin or not middleware is needed 

      if (checkPass) {
        const token = jwt.sign({ id: userExist._id, isAdmin: userExist.isAdmin }, 'tokenGenerate')

        return res.status(200).json({
          status: 'sucess',
          user: {
            token,
            email,
            //isAdmin and shipping address comes from db while token and email are already here
            isAdmin: userExist.isAdmin,
            shippingAddress: userExist.shippingAddress
          }
        })

      } else {
        return res.status(401).json({
          status: 'error',
          message: 'User and password doesn\'t match'
        })

      }

    } else {

      return res.status(401).json({
        status: 'error',
        message: 'user doesn\'t exist'
      })
    }




  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `${err}`
    });
  }

  return res.status(400).json('hello user')
}

// user signup

module.exports.userSignUp = async (req, res) => {

  const { fullname, email, password } = req.body

  try {

    //Check if user already exists 
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({
        status: 'error',
        message: 'email already in use'
      })
    } else {
      const hashedPass = await bcrypt.hash(password, 12);
      await User.create({
        fullname,
        email,
        password: hashedPass
      });
      return res.status(201).json({
        status: 'success',
        message: 'user successfully registered'
      })
    }




  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `${err}`
    });
  }
}



