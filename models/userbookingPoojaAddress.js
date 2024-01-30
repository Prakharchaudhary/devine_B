const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const UserBookingPoojaAddress = sequelize.define('UserBookingPoojaAddress', {
    UserBookingPoojaAddress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      physical_Pooja_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     houseNo: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'House number or building name',
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Locality or area',
    },
    landmark: {
      type: DataTypes.STRING,
      comment: 'Landmark near the location',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'City or town',
    },
    pinCode: {
      type: DataTypes.STRING(6), // Assuming PIN code is a 6-digit string
      allowNull: false,
      validate: {
        is: /^[0-9]{6}$/i, // Validation for 6 digits PIN code
      },
      comment: 'Postal code or PIN code (6 digits)',
    },
  });
  return UserBookingPoojaAddress;

}