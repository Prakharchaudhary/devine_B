var db = require('../models/index')
var userModels = db.userModels
var categoryTable = db.category
var userAddress = db.userAddress
var product = db.product
var userCart = db.userCart
var preistModel = db.preistModel
var userLocation = db.userLocation
var panditLocation = db.panditLocation
var PhysicalPooja = db.PhysicalPooja

var PoojaBooking = db.PoojaBooking
var userbookingPoojaAddress = db.userbookingPoojaAddress
var userReferCode = db.userReferCode
const sendMail = require('../helper/orderSendMail')










const otpGenerator = require('otp-generator');
const apiKey = 'Tu1jcZ2MGqODd9azxgoQsnfK0k78VytYFUHBJ6L3wrbiNEIlhRN5JRXg42H7ImxbLsKjvwEaOS0rWhlQ';




// const { Op } = require('sequelize');
// const sequelize = require('sequelize')
const {JWT_SECRET} = process.env
const jwt = require('jsonwebtoken')

const randomstring = require('randomstring');
const bcrypt = require('bcrypt');


const generateToken = (user_id) => {
    try {
      const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
      return token;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate token');
    }
  };
  const saltRounds = 10;


const signupUsers = async (req, res) => {
    const email = req.body.email;
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
  
    const mailSubject = 'OTP for Mail Verification';
    const content = `<p>Your OTP for mail verification is: ${otp}</p>`;
  
    try {
      await sendMail(email, mailSubject, content);
  
      const newUserData = await userModels.create({
        email: email,
        OTP: otp 
      });
  
      const id = newUserData.user_id;
      console.log('New user created:', newUserData.toJSON());
      res.status(201).json({ message: 'User created successfully.', id: id });
    } catch (error) {
      console.error('Error sending email or creating user:', error);
      res.status(500).json({ message: 'Error sending email or creating user.' });
    }
  };


  const resendEmail = async (req, res) => {
    const email = req.body.email;
  
    try {
      const user = await userProfile.findOne({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const newOtp = randomstring.generate({ length: 6, charset: 'numeric' });
  
      const mailSubject = 'New OTP for Mail Verification';
      const content = `<p>Your new OTP for mail verification is: ${newOtp}</p>`;
  
      await sendMail(email, mailSubject, content);
  
      await user.update({ OTP: newOtp });
  
      res.status(200).json({ message: 'Email resent successfully with new OTP.' });
    } catch (error) {
      console.error('Error resending email or updating OTP:', error);
      res.status(500).json({ message: 'Error resending email or updating OTP.' });
    }
  };


  const verifyOTP = (req, res) => {

    const  user_id = req.params.id
     const { otp } = req.body;
   
     userModels.findOne({ where: { user_id } })
       .then((existingUser) => {
         if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
         }
   
         if (existingUser.OTP === otp) {
       
           existingUser.update({ is_verified: true })
             .then(() => {
               return res.status(200).json({ message: 'OTP is valid. User verified successfully.' });
             })
             .catch((error) => {
               console.error('Error updating user:', error);
               return res.status(500).json({ message: 'Error updating user.' });
             });
         } else {
           return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
         }
       })
       .catch((error) => {
         console.error('Error finding user:', error);
         return res.status(500).json({ message: 'Error finding user.' });
       });
   };

   async function savePassword(req, res) {
    try {
      const { user_id } = req.body;
      const { password } = req.body;
      console.log(password);
  
      if (!password ) {
        return res.status(400).json({ error: 'Passwords not found' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await userModels.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password saved successfully' });
    } catch (error) {
      console.error('Error saving password:', error); 
      res.status(500).json({ error: 'Failed to save password' });
    }
  }


  const {validationResult} = require('express-validator')


  // const signUp = async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  
  //     // Validate email and password
  //     if (!email || !password) {
  //       return res.status(400).json({ message: 'Email and password are required fields.' });
  //     }
  //       const existingUser = await userModels.findOne({ where: { email: email } });
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'Email is already in use. Please choose another one.' });
  //     }
  
  //     const hashedPassword = await bcrypt.hash(password, 10);
  
  //     const newUser = await userModels.create({
  //       email: email,
  //       password: hashedPassword,
  //     });
  //       return res.status(201).json({ message: 'User registered successfully.', data: newUser });
  //   } catch (error) {
  //     // Handle specific Sequelize validation errors
  //     if (error.name === 'SequelizeValidationError') {
  //       const errors = error.errors.map(err => err.message);
  //       return res.status(400).json({ message: 'Validation error.', errors: errors });
  //     }
  
  //     // Handle other errors
  //     console.error('Error signing up:', error);
  //     return res.status(500).json({ message: 'Error signing up.', error: error.message });
  //   }
  // };

  const signUp = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
  
      // Validate email and password
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required fields.' });
      }
  
      const existingUser = await userModels.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use. Please choose another one.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = await userModels.create({
        email: email,
        password: hashedPassword,
      });
  
      // Generate a refer code
      const referCode = generateReferCode(); // Implement a function to generate a unique refer code
  
      // Save the refer code in the refer_codes table
      await userReferCode.create({
        refer_code: referCode,
        user_id: newUser.user_id, // Assuming 'id' is the primary key of the users table
      });
  
      return res.status(201).json({ message: 'User registered successfully.', data: newUser });
    } catch (error) {
      // Handle specific Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      // Handle other errors
      console.error('Error signing up:', error);
      return res.status(500).json({ message: 'Error signing up.', error: error.message });
    }
  };
  
  // Function to generate a unique refer code (you can implement your logic)
  function generateReferCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referCode = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referCode += characters.charAt(randomIndex);
    }
  
    return referCode;
  }
  
  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModels.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // if (!user.is_verified) {
      //   return res.status(401).json({ message: 'Email is not verified. Please verify your email first.' });
      // }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
      console.log(password);
      console.log(user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      const token = generateToken(user.user_id); 
      console.log(user.user_id);
  
      user.token = token;
      await user.save(); 
  
      res.status(200).json({ message: 'User logged in successfully.', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user.' });
    }
  };


const createAddress = async (req, res) => {
  try {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const { name, address, city, state, zipCode, country, phone } = req.body;
    const newAddress = await userAddress.create({
      name,
      user_id:userId,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
    });

    res.status(201).json({ message: 'Address created successfully.', data: newAddress });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Error creating address.' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const { name, address, city, state, zipCode, country, phone } = req.body;
    const updatedAddress = await userAddress.update(
      {
        name,
        address,
        city,
        state,
        zipCode,
        country,
        phone,
      },
      {
        where: { user_id:userId },
        returning: true,
      }
    );
    res.status(200).json({ message: 'Address updated successfully.', data: updatedAddress[1][0] });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Error updating address.' });
  }
};

const getAddressByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const address = await userAddress.findOne({
      where: { user_id:userId },
    });

    if (!address) {
      res.status(404).json({ message: 'Address not found for the user.' });
    } else {
      res.status(200).json({ message: 'Address retrieved successfully.', data: address });
    }
  } catch (error) {
    console.error('Error retrieving address:', error);
    res.status(500).json({ message: 'Error retrieving address.' });
  }
};


const addToCart = async (req, res) => {
  try {
    // Check for the JWT token in the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const { product_id, quantity } = req.body;
    const products = await product.findOne({ where: { product_id: product_id } });
    if (!products) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const price = products.rs;
    const total_price = price * quantity;

    const newCartItem = await userCart.create({
      product_id,
      user_id: userId,
      quantity,
      total_price,
    });
    res.status(201).json({ message: 'Product added to cart successfully', cartItem: newCartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};


const getUserCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const cartItems = await userCart.findAll({
      where: { user_id: userId },
      include: { model: product }, 
    });

    let total_price = 0;
    cartItems.forEach((cartItem) => {
      total_price += cartItem.total_price;
    });

    res.status(200).json({ cartItems, total_price });
  } catch (error) {
    console.error('Error getting user cart:', error);
    res.status(500).json({ error: 'Failed to get user cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { CartItems_id, quantity } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const cartItem = await userCart.findOne({
      where: { CartItems_id, user_id: userId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    const products = await product.findOne({ where: { product_id: cartItem.product_id } });
    if (!products) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const price = products.rs;
    const total_price = price * quantity;
    await cartItem.update({
      quantity,
      total_price,
    });
    res.status(200).json({ message: 'Cart item updated successfully', cartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { CartItems_id } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const cartItem = await userCart.findOne({
      where: { CartItems_id, user_id: userId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};


const userLogout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; 
  const decodedToken = jwt.decode(token);
  const userid = decodedToken.user_id;

  // Remove token from user table in the database
  userModels.update({ token: null }, { where: { user_id: userid } })
    .then(() => {
      res.status(200).json({ message: 'User logged out successfully.' });
    })
    .catch((error) => {
      console.error('Error logging out user:', error);
      res.status(500).json({ message: 'Error logging out user.' });
    });
};



async function sendOTP(req, res) {
  try {
    const { phoneNumber } = req.body;
    const otpCode = Math.floor(1000 + Math.random() * 9000);
    console.log('Generated OTP:', otpCode);

    // Save the OTP entry in the database
    const otpEntry = await UserProfileDetail.create({
      phoneNumber: phoneNumber,
      otp: otpCode,
    });

    const formattedPhoneNumber = phoneNumber;

    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: apiKey,
        route: 'otp',
        variables_values: otpCode.toString(), 
        numbers: formattedPhoneNumber,
        flash: '0',
      },
    });

    console.log('OTP sent:', response.data);

    const userId = otpEntry.id;

    res.json({ message: 'OTP sent successfully', userId: userId });
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Error sending OTP:', error.response.data);
      res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  }
}
async function resendOTP(req, res) {
  try {
    const { phoneNumber } = req.params; // Get the phone number from the params
    const otpCode = Math.floor(1000 + Math.random() * 9000);
    console.log('Generated OTP:', otpCode);

    const existingOTPEntry = await UserProfileDetail.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!existingOTPEntry) {
      console.log('OTP entry not found for the provided phone number');
      return res.status(404).json({ error: 'OTP entry not found for the provided phone number' });
    }

    existingOTPEntry.otp = otpCode;
    await existingOTPEntry.save();


    const formattedPhoneNumber = phoneNumber;

    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: apiKey,
        route: 'otp',
        variables_values: otpCode.toString(),
        numbers: formattedPhoneNumber,
        flash: '0',
      },
    });

    console.log('OTP sent:', response.data);

    const userId = existingOTPEntry.id;

    res.json({ message: 'OTP resent successfully', userId: userId });
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Error resending OTP:', error.response.data);
      res.status(500).json({ error: 'Failed to resend OTP' });
    } else {
      console.error('Error resending OTP:', error);
      res.status(500).json({ error: 'Failed to resend OTP' });
    }
  }
}


async function addPriestInfo(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { name, skills, House_no, building, area, city, pincode, state, user_id } = req.body;
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',');

    // Create a new record in preistModel
    const priest = await preistModel.create({
      name,
      skills: skillsArray,
      House_no,
      building,
      area,
      city,
      pincode,
      state,
      user_id: userId,
    });

    // Delete the old token and save the new token
    const newToken = generateToken(priest.id); 

    // Update the user's token in your user model or wherever it is stored
    await userModels.update({ token: newToken }, { where: { user_id: userId } });

    res.status(201).json({ priest, newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



async function getPriestInfo(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Retrieve preist information from the database based on preistId
    const preist = await preistModel.findOne({ where: { user_id: userId } });

    if (preist) {
      res.status(200).json(preist);
    } else {
      res.status(404).json({ message: 'Preist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}





async function updatePriestInfoByToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id (priest's ID) from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const priestId = decoded.user_id; // Assuming user_id in the token represents the priest's ID

    if (!priestId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { name, skills, House_no, building, area, city, pincode, state, user_id } = req.body;

    // Check if skills is a comma-separated string, convert it to an array
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',');

    // Fetch the priest's information by ID
    const priest = await preistModel.findByPk(priestId);

    if (!priest) {
      return res.status(404).json({ message: 'Priest not found' });
    }

    // Update the priest's information
    await priest.update({
      name,
      skills: skillsArray, 
      House_no,
      building,
      area,
      city,
      pincode,
      state,
      user_id,
    });

    res.status(200).json(priest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}




// async function updateUserLocation(req, res) {
//   // console.log(req.body);
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized: Token missing' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.user_id;
//   const { latitude, longitude, recordedDate, recordedTime } = req.body;

//   try {
//     // Check if recordedDate and recordedTime are present in the request body
//     if (!recordedDate || !recordedTime) {
//       return res.status(400).json({ error: 'Recorded date and time are required.' });
//     }

   

//     // Create a new location record
//     const location = await userLocation.create({
//       latitude,
//       longitude,
//       user_id: userId,
//       recordedDate: recordedDate,
//       recordedTime: recordedTime,
//     });
// // console.log({data: location});
//     return res.status(201).json({ message: 'Location updated successfully.', data: location });
//   } catch (error) {
//     console.error('Error updating location:', error);
//     return res.status(500).json({ message: 'Error updating location.', error: error.message });
//   }
// }






async function updateUserLocation(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id;
  // const { latitude, longitude } = req.body;
  const { latitude, longitude, recordedDate, recordedTime } = req.body;
  try {
    // Check if a location entry for the user already exists
    const existingLocation = await userLocation.findOne({
      where: { user_id: userId },
    });
    if (!recordedDate || !recordedTime) {
      return res.status(400).json({ error: 'Recorded date and time are required.' });
    }
    if (existingLocation) {
      // If exists, update the existing entry
      await existingLocation.update({
        latitude,
        longitude,
        recordedDate: recordedDate,
        recordedTime: recordedTime,
      });

      return res.status(200).json({ message: 'Location updated successfully.', data: existingLocation });
    } else {
      // If doesn't exist, create a new entry
      const location = await userLocation.create({
        latitude,
        longitude,
        user_id: userId,
      });

      return res.status(201).json({ message: 'Location added successfully.', data: location });
    }
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ message: 'Error updating location.', error: error.message });
  }
}


const { Sequelize, DataTypes, Op } = require('sequelize');
// const PhysicalPooja = require('../models/PhysicalPooja')
// async function findNearbyPandits(req, res) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized: Token missing' });
//   }

//   // Verify the token and get the user_id from the payload
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.user_id;

//   if (!userId) {
//     return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//   }

//   try {
//     // Fetch user's latitude and longitude
//     const user = await userLocation.findOne({
//       where: { user_id: userId },
//       attributes: ['latitude', 'longitude'],
//     });

//     if (!user || !user.latitude || !user.longitude) {
      // return res.status(404).json({ message: 'User location not found.' });
//     }

//     const userLatitude = user.latitude;
//     const userLongitude = user.longitude;
//     const maxDistance = 18; // Maximum distance in kilometers 

//     // Find pandits within the specified distance

//     const nearbyPandits = await panditLocation.findAll({
//       attributes: [
//         'id',
//         'latitude',
//         'longitude',
//         // ... other attributes you want to retrieve
//       ],
//       where: Sequelize.where(
//         Sequelize.fn(
//           'ST_Distance_Sphere',
//           Sequelize.literal(`point(${userLongitude}, ${userLatitude})`),
//           Sequelize.literal('point(longitude, latitude)')
//         ),
 //       ),
//     });

//     return res.status(200).json({ message: 'Nearby pandits retrieved successfully.', data: nearbyPandits });
//   } catch (error) {
//     console.error('Error finding nearby pandits:', error);
//     return res.status(500).json({ message: 'Error finding nearby pandits.', error: error.message });
//   }
// }



const savePoojaBooking = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Extract details from the request body
    const { physical_Pooja_id, pooja_booking_No, date, Address } = req.body;

    // Create a new PoojaBooking record
    const poojaBooking = await PoojaBooking.create({
      user_id: userId,
      status: 'pending', // You can set the default status here
      physical_Pooja_id,
      pooja_booking_No,
      date,
      Address,
    });

    return res.status(200).json({ message: 'Pooja booking saved successfully.', data: poojaBooking });
  } catch (error) {
    console.error('Error saving pooja booking:', error);
    return res.status(500).json({ message: 'Error saving pooja booking.', error: error.message });
  }
};


async function findNearbyPandits(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  // Verify the token and get the user_id from the payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    // Fetch user's latitude and longitude
    const user = await userLocation.findOne({
      where: { user_id: userId },

      attributes: ['latitude', 'longitude'],
      order: [['createdAt', 'DESC']],
      limit: 1, // Limit to one result to get the latest data
    });

    if (!user || !user.latitude || !user.longitude) {
      return res.status(404).json({ message: 'User location not found.' });
    }
    console.log(userId);

    const userLatitude = user.latitude;
    const userLongitude = user.longitude;
    console.log(userLatitude);
    const maxDistance = 18; // Maximum distance in kilometers 

    // Find pandits within the specified distance
    const nearbyPandits = await panditLocation.findAll({
      attributes: [
        'id',
        'latitude',
        'longitude',
        // ... other attributes you want to retrieve
      ],

      where: Sequelize.where(
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.literal(`point(${userLongitude}, ${userLatitude})`),
          Sequelize.literal('point(longitude, latitude)')
        ),
        { [Op.lte]: maxDistance * 1000 } // Convert maxDistance to meters
      ),
    });

    // Fetch data from PoojaBooking table for the same user
    // const userPoojaBookings = await PoojaBooking.findAll({
    //   where: { user_id: userId },
    // });

    const userPoojaBookings = await PoojaBooking.findAll({
      where: { user_id: userId },
     
    });


    return res.status(200).json({
      message: 'Nearby pandits and user pooja bookings retrieved successfully.',
      data: { nearbyPandits, userPoojaBookings },
    });
  } catch (error) {
    console.error('Error finding nearby pandits:', error);
    return res.status(500).json({
      message: 'Error finding nearby pandits.',
      error: error.message,
    });
  }
}

const savePoojaAddress = async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  // Verify the token and get the user_id from the payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id;
  const physical_Pooja_id  = req.params.physical_Pooja_id
  
  

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  try {
    const existingPooja = await PhysicalPooja.findOne({ where: { physical_Pooja_id: physical_Pooja_id } });
    if (!existingPooja) {
      return res.status(404).json({ error: 'Pooja not found' });
    }
    const {houseNo,locality ,Landmark ,city , pinCode  } = req.body
    const saveAddress = await userbookingPoojaAddress.create({
      physical_Pooja_id:physical_Pooja_id ,user_id:userId,houseNo,locality ,Landmark ,city , pinCode

    })
    return res.status(200).json({ message: 'Pooja booking address saved successfully.', data: saveAddress });

    
  } catch (error) {
    console.error('Error saving pooja booking:', error);
    return res.status(500).json({ message: 'Error saving pooja booking.', error: error.message });
    
  }

} 


const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
  // console.log(oldPassword);
  // console.log(newPassword);

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;
    // Check if the user with the provided ID exists
    const user = await userModels.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid current password.' });
    }
    // console.log(password);
    // console.log(user.password);
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);

    // Update the user's password
    await userModels.update(
      { password: hashedPassword },
      {
        where: {
          user_id,
        },
      }
    );

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password.' });
  }
};


const changePassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await userModels.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
console.log(email);
    // Generate a unique identifier (you can use user ID or any other unique field)
    const identifier = user.user_id; // Replace this with the unique identifier

    // Create the link with the unique identifier and the website password reset page route
    const resetLink = `https://divinezone.azurewebsites.net/ResetPassword?user=${identifier}`;
    
    // Create the email content with the reset link
    const mailSubject = 'Reset Password Link';
    const content = `<p>Click the link below to reset your password:<br><a href="${resetLink}">${resetLink}</a></p>`;
    console.log(content);

    try {
      // Send the email with the reset link
      await sendMail(email, mailSubject, content);

      res.status(200).json({ message: 'Reset password link sent successfully. Please check your email.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email.' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
};

 
const ResetPasswordById = async (req, res) => {
  try {
    const userId = req.query.user;
    console.log(userId);
    const { newPassword } = req.body;
    const { confirmPassword } = req.body;
    if(confirmPassword!==newPassword){
      return res.status(404).json({ message: 'password not match.' });

    }



    // Fetch the user based on the user ID
    const user = await userModels.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);

    // Update the user's password in the database
    await userModels.update(
      { password: hashedPassword },
      { where: { user_id: userId } }
    );

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password.' });
  }
};


const fetchReferral = async(req, res)=>{
  try {
    const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  // Verify the token and get the user_id from the payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.user_id;
  const findData = await userReferCode.findOne({ where: { user_id: userId } })
  const findRefer = findData.refer_code
  res.status(200).json({ data: 'refer code fetch successfully.',data:findRefer });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password.' });
    
  }
  


}

  module.exports = {signupUsers,resendEmail,verifyOTP,savePassword,loginUser,createAddress,updateAddress,getAddressByUserId,addToCart
    ,getUserCart,deleteCartItem,updateCartItem,deleteCartItem,userLogout,sendOTP,resendOTP,addPriestInfo,
    findNearbyPandits,getPriestInfo,savePoojaBooking,updatePriestInfoByToken,signUp,updateUserLocation,savePoojaAddress,updatePassword,
    changePassword,ResetPasswordById,fetchReferral}    