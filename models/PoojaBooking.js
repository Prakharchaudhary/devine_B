// Assuming you are using Sequelize
const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize) => {

const PoojaBooking = sequelize.define('PoojaBooking', {
    PoojaBooking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
//   pandit_id
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  physical_Pooja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pooja_booking_No: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,

     allowNull: false,
  },
 
});
 return PoojaBooking
}


