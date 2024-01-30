
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const user_Locations_pooja = sequelize.define('user_Locations_pooja', {
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recordedDate: {
      type: DataTypes.STRING, // Change to DATE type
      allowNull: true, // Allow null values
    },
    recordedTime: {
      type: DataTypes.STRING, // Change to TIME type
      allowNull: true, // Allow null values
    },
  });

  return user_Locations_pooja;
};



