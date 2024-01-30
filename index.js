require("dotenv").config()



const express = require('express');
const cors = require('cors');


const app = express()

app.use(cors({
    credentials:true
}));


require('./models/index')

app.use(express.json());

app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let destinationFolder = '';
  
      // Determine the destination folder based on file type
      
      if (file.mimetype.startsWith('image/')) {
        destinationFolder = path.join(__dirname, './public/image');
      } else if (file.mimetype.startsWith('audio/')) {
        destinationFolder = path.join(__dirname, './public/audio');
      } else {
        // Handle other file types or throw an error 
        console.log("object")
        return cb(new Error('Unsupported file type'));
      }
  
      cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);  
    },
  });
  
  const upload = multer({ storage: storage });
  

    const bodyParser = require('body-parser')

    app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

    

const {signUpValidation,loginValidation} = require('./helper/validation')


    app.get('/api', (req, res) => {
        res.send(' hello world')
    })

    // app.get('/file?', (req, res) => {
    //     //http://localhost:7000/file?filename=1700069535579-Comayagua-[honduras.webp
    //     // console.log(__dirname)
    //     // console.log(__dirname);
    //     res.sendFile(__dirname+`/public/image/${req.query.filename}`)
    // })
    // app.get('/audio', (req, res) => {
    //     const audioPath = path.join(__dirname, '/public/audio/', req.query.filename);
    //     res.sendFile(audioPath);
    //   });
    
    const {isAuthorize} = require('./middlewares/auth') 


    var userController = require('./controllers/userController');
    var adminController = require('./controllers/adminController');
    var panditControllers = require('./controllers/panditControllers');



    // users API
      app.post("/register",userController.signupUsers);
      app.post("/resendEmail",userController.resendEmail);
      app.post("/verifyOTP/:id",userController.verifyOTP);
      app.post("/savePassword",userController.savePassword);
      app.post("/loginUser",userController.loginUser);
      app.post("/createAddress/",isAuthorize,userController.createAddress);
      app.post("/updateAddress/",isAuthorize,userController.updateAddress);
      app.get("/getAddressByUserId/",isAuthorize,userController.getAddressByUserId);
      app.post("/addToCart",isAuthorize,userController.addToCart);
      app.get("/getUserCart",isAuthorize,userController.getUserCart);
      app.post("/updateCartItem",isAuthorize,userController.updateCartItem);
      app.post("/deleteCartItem",isAuthorize,userController.deleteCartItem);
      app.post("/userLogout",isAuthorize,userController.userLogout);
      app.post("/addPriestInfo",isAuthorize,userController.addPriestInfo);
      app.get("/getPriestInfo",isAuthorize,userController.getPriestInfo);
      app.patch("/updatePriestInfoByToken",isAuthorize,userController.updatePriestInfoByToken);
      app.post("/signUp",signUpValidation,userController.signUp);
      app.patch("/updateUserLocation",isAuthorize,userController.updateUserLocation);
      app.get("/findNearbyPandits",isAuthorize, userController.findNearbyPandits);
      app.post("/savePoojaBooking",isAuthorize, userController.savePoojaBooking);
      app.post("/savePoojaAddress/:physical_Pooja_id",isAuthorize, userController.savePoojaAddress);
      app.patch("/updatePassword",isAuthorize,userController.updatePassword);
      app.patch("/changePassword",userController.changePassword);
      app.patch("/resetPasswordById",userController.ResetPasswordById);
      app.get("/fetchReferral",isAuthorize,userController.fetchReferral);
      // app.post('/resetPassword',userController.forgetPassword)
      // app.get('/reset-password',userController.resetPasswordLoad)
      // app.post('/reset-password',userController.resetPassword)

      // admin API
      app.post("/addCategory",upload.single('image'),adminController.addCategory);
      app.get("/getAllCategories",adminController.getAllCategories);
      app.get("/getCategoryById/:id",adminController.getCategoryById);
      app.post("/updateCategory/:id",adminController.updateCategory);
      app.post("/deleteCategory/:id",adminController.deleteCategory);
      app.post("/addBanner",upload.fields([{ name:'image1',maxCount: 1}, { name: 'image2' }, { name: 'image3' }]),adminController.addBanner);
      app.post("/updateBanner",upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]),adminController.updateBanner);
      app.get("/getBanner",adminController.getBanner);
      app.post("/addProduct/:id",upload.single('image'),adminController.addProduct);
      app.get("/getProductbyID/:id",adminController.getProductbyID);
      app.get("/getProductbyCategoryID/:category_id",adminController.getProductbyCategoryID);
      app.post("/updateProduct/:id",adminController.updateProduct); 
      app.post("/deleteProduct/:id",adminController.deleteProduct);
      app.post("/addUnit",adminController.addUnit);
      app.get("/getAllUnit",adminController.getAllUnit);
      app.get("/getAllCategoryWithProduct",adminController.getAllCategoryWithProduct);
      app.get("/getOneUnit/:unit_id",adminController.getOneUnit);
      app.patch("/updateUnit/:unit_id",adminController.updateUnit);
      app.delete("/deleteUnit/:unit_id",adminController.deleteUnit);
      app.post("/addSuppliers",upload.single('image'),adminController.addSuppliers);
      app.get("/getSupplier/:supplier_id",upload.single('image'),adminController.getSupplier);
      app.get("/getAllSupplier/",upload.single('image'),adminController.getAllSupplier);
      app.patch("/updateSupplier/:supplier_id",upload.single('image'),adminController.updateSupplier);
      app.delete("/deleteSupplier/:supplier_id",adminController.deleteSupplier);
      app.post("/addPhysicalPooja",upload.single('image'),adminController.addPhysicalPooja);
      app.get("/getPhysicalPooja/:physical_Pooja_id",upload.single('image'),adminController.getPhysicalPooja);
      app.get("/getAllPhysicalPooja/",upload.single('image'),adminController.getAllPhysicalPooja);
      app.patch("/updatePhysicalPooja/:physical_Pooja_id",upload.single('image'),adminController.updatePhysicalPooja);
      app.delete("/deletePhysicalPooja/:physical_Pooja_id",adminController.deletePhysicalPooja);

      
      // app.post('/addmantras', upload.fields([
      //   { name: 'image1', maxCount: 1 },
      //   { name: 'image2', maxCount: 1 },
      //   { name: 'image3', maxCount: 1 },
      // ]), adminController.addmantras);

      app.post("/addmantras", (req, res, next) => {
        upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }])(req, res, (err) => {
          if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({ message: 'Error during file upload', error: err.message });
          }
          // Continue processing the request
          next();
        });
      }, adminController.addmantras);

      


    //   app.post("/addmantras/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 },adminController.addmantras]))
    // app.post("/addmantras/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), adminController.addmantras);
    app.get("/getAllMantras/",adminController.getAllMantras);
    app.get("/getAllMantrasForBuild/",adminController.getAllMantrasForBuild);
    app.get("/getMantra/:mantras_id",adminController.getMantra);
    app.patch("/updateMantras/:mantras_id",adminController.updateMantras);
    app.delete("/deleteMantras/:mantras_id",adminController.deleteMantras);
    app.post("/addNewProduct/",upload.single('image'),adminController.addNewProduct);
    app.get("/getnewProductDetails/:id",adminController.getnewProductDetails);
    app.get("/getAllProductDetails/",adminController.getAllProductDetails);
    app.put("/updateProductDetails/:product_id",upload.single('image'),adminController.updateProductDetails);
    app.delete("/deleteMainProduct/:product_id",adminController.deleteMainProduct);
    app.get("/getAllPreist/",adminController.getAllPreist);
    app.get("/getPriestInfo/:id",adminController.getPriestInfo);
    app.patch("/updatePriestByAdmin/:id",adminController.updatePriestByAdmin);
    app.delete("/deletePanditByAdmin/:id",adminController.deletePanditByAdmin);
    app.post("/addVirtualPooja",upload.single('image'),adminController.addVirtualPooja)
    app.get("/getAllVirtualPoojas/",adminController.getAllVirtualPoojas);
    app.get("/getVirtualPoojaById/:id",adminController.getVirtualPoojaById);
    app.patch("/updateVirtualPoojaById/:id",adminController.updateVirtualPoojaById);
    app.delete("/deleteVirtualPoojaById/:id",adminController.deleteVirtualPoojaById);
    app.post("/addmantrasCategory",upload.single('image'),adminController.addmantrasCategory);
    app.get("/getAllMantrasCategory",adminController.getAllMantrasCategory);
    app.get("/getMantraCategoryById/:category_id",adminController.getMantraCategoryById);
    app.patch("/updateMantraCategoryById/:category_id",adminController.updateMantraCategoryById);
    app.delete("/deleteMantraByCategoryId/:category_id",adminController.deleteMantraByCategoryId);
    // pandit API
    app.patch("/updatePanditLocation",isAuthorize, panditControllers.updatePanditLocation);
    app.get("/getNewProductbyID/:id",adminController.getNewProductbyID);

    const PORT = process.env.PORT || 7000
    app.listen(PORT, () => {
        console.log('app will running on port 7000 ');
    })