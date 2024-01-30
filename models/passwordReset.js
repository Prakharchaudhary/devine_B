const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes)=>{


    const PasswordReset = sequelize.define('passwordReset', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
        timestamps:false
    
    });
    return PasswordReset
    
    }
    
    