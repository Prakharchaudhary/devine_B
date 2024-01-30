var db = require('../models/index')
var preistModel = db.preistModel
var panditLocation = db.panditLocation
const { Op ,Sequelize} = require('sequelize');
const {JWT_SECRET} = process.env
const jwt = require('jsonwebtoken')



async function updatePanditLocation(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    const { latitude, longitude } = req.body;
  
    try {
      // Check if a location entry for the user already exists
      const existingLocation = await panditLocation.findOne({
        where: { id: userId },
      });
  
      if (existingLocation) {
        // If exists, update the existing entry
        await existingLocation.update({
          latitude,
          longitude,
        });
  
        return res.status(200).json({ message: 'Location updated successfully.', data: existingLocation });
      } else {
        // If doesn't exist, create a new entry
        const location = await panditLocation.create({
          latitude,
          longitude,
          id: userId,
        });
  
        return res.status(201).json({ message: 'Location added successfully.', data: location });
      }
    } catch (error) {
      console.error('Error updating location:', error);
      return res.status(500).json({ message: 'Error updating location.', error: error.message });
    }
  }



  

  module.exports = {updatePanditLocation}
  
