
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const newProductTable = sequelize.define('newProductTable', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_id: {
        type: DataTypes.INTEGER, 
        allowNull: true,
    },
    unitValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER, // Adjust the data type based on your category primary key type
        allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    supplier_id: {
        type: DataTypes.INTEGER, // Adjust the data type based on your category primary key type
        allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return newProductTable;
};


