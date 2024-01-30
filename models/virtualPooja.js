const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const virtual_pooja = sequelize.define('virtual_pooja', {
    virtual_Pooja_id: {
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

  return virtual_pooja;
};
