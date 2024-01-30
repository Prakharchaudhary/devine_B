
module.exports = (sequelize, DataTypes) => {

const PriestInformation = sequelize.define('preistinformation', {
  
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
        type: DataTypes.STRING, 
        allowNull: false,
        get() {
          return this.getDataValue('skills') ? this.getDataValue('skills').split(',') : [];
        },
        set(val) {
          this.setDataValue('skills', val.join(','));
        },
      },
    House_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    building: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });
  return PriestInformation;

}
  
  
