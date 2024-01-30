const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
      supplier_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplier_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplier_Mobile:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    supplierAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supplierState: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supplierPinCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supplier_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Supplier;
};
