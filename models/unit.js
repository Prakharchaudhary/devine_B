const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const unit = sequelize.define('Unit', {
      unit_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return unit;
};