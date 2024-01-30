const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Physical_pooja = sequelize.define('Physical_pooja', {
      physical_Pooja_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Physical_pooja;
};
