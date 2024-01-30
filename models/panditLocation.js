
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {

const pandit_Locations = sequelize.define('pandit_Locations', {
    pandit_location_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
return pandit_Locations;

}

