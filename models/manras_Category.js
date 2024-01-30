module.exports = (sequelize, DataTypes) => {
    const mantras_category = sequelize.define(
      'mantras_category',
      {
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        category_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        details: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          image: {
            type: DataTypes.STRING,
            allowNull: true,
          },
     
      },
      {
        tableName: 'mantras_category',
        timestamps: false,
      }
    );
  
    return mantras_category;
  };
  
  