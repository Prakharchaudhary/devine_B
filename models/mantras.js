const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const mantras = sequelize.define('mantras', {
      mantras_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
    //name
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // image
    artWork: {
        type: DataTypes.STRING(555), // Adjust the length based on your filename requirements
        allowNull: false,
      },
  
    //MP3
    URL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    //desciption
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
      },

  });

  return mantras;
};
