const { Sequelize,DataTypes } = require('sequelize');



// const sequelize = new Sequelize('divine', 'root', 'cprakhar999@gmail.com', {
//   host: 'localhost',
//   logging:false,
//   dialect: 'mysql',
//   // operatorsAliases: false,

// });

//   sequelize.authenticate() 
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });






  // const azureMysqlConfig = {
  //   host: 'divinezone.mysql.database.azure.com',
  //   port: 3306,
  //   username: 'root',
  //   password: 'divineAmi1n!',
  //   database: 'divine',
  //   dialect: 'mysql',
  //   dialectOptions: {
  //     ssl: {
  //       rejectUnauthorized: false, // You might need to set this to true in a production environment
  //     },
  //     logging: false, // Set logging to false to disable Sequelize logs

  //   },
  // };
  
  


  
  // // Create Sequelize instance
  // const sequelize = new Sequelize(azureMysqlConfig);
  //   sequelize.authenticate()
  //   .then(() => {
  //     console.log('Connection has been established successfully.');
  //   })
  //   .catch((error) => {
  //     console.error('Unable to connect to the database:', error);
  //   });

// const sequelize = new Sequelize('divine', 'root', 'cprakhar999@gmail.com', {
//  host: 'localhost',
//  logging:false,
//  dialect: 'mysql',
// operatorsAliases: false,
// });





  // const azureMysqlConfig = {
  //   host: 'divinezone.mysql.database.azure.com',
  //   port: 3306,
  //   username: 'root',
  //   password: 'divineAmi1n!',
  //   database: 'divine',
  //   dialect: 'mysql',
  //   dialectOptions: {
  //     ssl: {
  //       rejectUnauthorized: false, // You might need to set this to true in a production environment
  //     },
  //   },
  //   logging: false, // Set logging to false to disable Sequelize logs
  // };
  
  // // Create Sequelize instance
  // const sequelize = new Sequelize(azureMysqlConfig.database, azureMysqlConfig.username, azureMysqlConfig.password, {
  //   host: azureMysqlConfig.host,
  //   port: azureMysqlConfig.port,
  //   dialect: azureMysqlConfig.dialect,
  //   dialectOptions: azureMysqlConfig.dialectOptions,
  //   logging: false, // Set logging to false to disable MySQL2 logs
  // });
  
  // sequelize.authenticate()
  //   .then(() => {
  //     console.log('Connection has been established successfully.');
  //   })
  //   .catch((error) => {
  //     console.error('Unable to connect to the database:', error);
  //   });


  const path = require('path');
  const fs = require('fs');
  const caPath = path.join(__dirname, '..', 'certificates', 'DigiCertGlobalRootCA.crt.pem');
  const ca = fs.readFileSync(caPath);
  const azureMysqlConfig = {
    host: 'divinezone.mysql.database.azure.com',
    port: 3306,
    username: 'root',
    password: 'divineAmi1n!',
    database: 'divine',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: ca, 
      },
    },
        logging: false, // Set logging to false to disable MySQL2 logs

  };
  
  // Create Sequelize instance
  const sequelize = new Sequelize(azureMysqlConfig);
    sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });

  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize
  

  db.userModels = require('./userModels')(sequelize,DataTypes)
  db.category = require('./category')(sequelize,DataTypes)
  db.banner = require('./banner')(sequelize,DataTypes)
  db.product = require('./product')(sequelize,DataTypes)
  db.userAddress = require('./userAddress.')(sequelize,DataTypes)
  db.userCart = require('./userCart')(sequelize,DataTypes)
  db.preistModel = require('./preistModel')(sequelize,DataTypes)
  db.unit = require('./unit')(sequelize,DataTypes)
  db.suppliers = require('./suppliers')(sequelize,DataTypes)
  db.mantras = require('./mantras')(sequelize,DataTypes)
  db.newProduct = require('./newProduct')(sequelize,DataTypes)
  db.PhysicalPooja = require('./PhysicalPooja')(sequelize,DataTypes)
  db.panditLocation = require('./panditLocation')(sequelize,DataTypes)
  db.userLocation = require('./userLocation')(sequelize,DataTypes)
  db.PoojaBooking = require('./PoojaBooking')(sequelize,DataTypes)
  db.userbookingPoojaAddress = require('./userbookingPoojaAddress')(sequelize,DataTypes)
  db.virtualPooja = require('./virtualPooja')(sequelize,DataTypes)
  db.userReferCode = require('./userReferCode')(sequelize,DataTypes)
  db.manras_Category = require('./manras_Category')(sequelize,DataTypes)






  db.category.hasMany( db.product,{foreignKey:'category_id'})
  db.product.belongsTo(db.category,{ foreignKey: 'category_id' })

  
  db.userModels.hasMany( db.userAddress,{foreignKey:'user_id'})
  db.userAddress.belongsTo(db.userModels,{ foreignKey: 'user_id' })

  db.userModels.hasMany( db.userCart,{foreignKey:'user_id'})
  db.userCart.belongsTo(db.userModels,{ foreignKey: 'user_id' })


  db.product.hasMany( db.userCart,{foreignKey:'product_id'})
  db.userCart.belongsTo(db.product,{ foreignKey: 'product_id' })

  db.userModels.hasMany( db.preistModel,{foreignKey:'user_id'})
  db.preistModel.belongsTo(db.userModels,{ foreignKey: 'user_id' })

  db.category.hasMany( db.newProduct,{foreignKey:'category_id'})
  db.newProduct.belongsTo(db.category,{ foreignKey: 'category_id' })

  
  db.unit.hasMany( db.newProduct,{foreignKey:'unit_id'})
  db.newProduct.belongsTo(db.unit,{ foreignKey: 'unit_id' })


  db.suppliers.hasMany( db.newProduct,{foreignKey:'supplier_id'})
  db.newProduct.belongsTo(db.suppliers,{ foreignKey: 'supplier_id' })


  db.userModels.hasMany( db.userLocation,{foreignKey:'user_id'})
  db.userLocation.belongsTo(db.userModels,{ foreignKey: 'user_id' })
  
  db.preistModel.hasMany( db.panditLocation,{foreignKey:'id'})
  db.panditLocation.belongsTo(db.preistModel,{ foreignKey: 'id' })

  //pooja booking
  db.userModels.hasMany( db.PoojaBooking,{foreignKey:'user_id'})
  db.PoojaBooking.belongsTo(db.userModels,{ foreignKey: 'user_id' })

  db.preistModel.hasMany( db.PoojaBooking,{foreignKey:'id'})
  db.PoojaBooking.belongsTo(db.preistModel,{ foreignKey: 'id' })

  db.PhysicalPooja.hasMany( db.PoojaBooking,{foreignKey:'physical_Pooja_id'})
  db.PoojaBooking.belongsTo(db.PhysicalPooja,{ foreignKey: 'physical_Pooja_id' })

  db.userModels.hasMany( db.userbookingPoojaAddress,{foreignKey:'user_id'})
  db.userbookingPoojaAddress.belongsTo(db.userModels,{ foreignKey: 'user_id' })

  db.PhysicalPooja.hasMany( db.userbookingPoojaAddress,{foreignKey:'physical_Pooja_id'})
  db.userbookingPoojaAddress.belongsTo(db.PhysicalPooja,{ foreignKey: 'physical_Pooja_id' })

  db.userModels.hasMany(  db.userReferCode, { foreignKey: 'user_id' });
  db.userReferCode.belongsTo( db.userModels, { foreignKey: 'user_id' });
  
  

  sequelize.sync({force:false})

  module.exports = db
