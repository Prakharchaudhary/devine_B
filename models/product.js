const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
      product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseBook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id:{
        type: DataTypes.INTEGER,
    },
    rs: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    
    instock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Product;
};
