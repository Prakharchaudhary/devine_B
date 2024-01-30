var db = require('../models/index')
var categoryTable = db.category
var banners = db.banner
var product = db.product
var units = db.unit
var suppliers = db.suppliers
var PhysicalPooja = db.PhysicalPooja
var mantras = db.mantras
var newProduct = db.newProduct
var preistModel = db.preistModel
var virtualPooja = db.virtualPooja
var manras_Category = db.manras_Category
  var path = require('path');


var containerName = "public"; // Replace with your container name



const { uploadFileToAzure } = require("../middlewares/azureStorageConn");

// const path = require('path');


// const fileUrl = `${'http://localhost:7000'}/image/${image}`




const addCategory = async (req, res) => {
    try {
      const category = req.body.category_name;
  
      if (!category) {
        return res.status(400).json({ error: 'Please provide category name.' });
      }

      let image = null;
      if (req.file) {
        // Generate a unique filename based on the current date and time
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const fileExtension = req.file.originalname.split('.').pop();
        image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
        
        const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);
  
        if (!imageUploadSuccess) {
          return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
        } 
      }
  
      // Create a new category in the database
      const newCategory = await categoryTable.create({
         category_name: category ,
         image:`https://divinestorage.blob.core.windows.net/${containerName}/${image}`

        });
  
      // Send success response
      res.status(201).json({ message: 'Category added successfully.', data: newCategory });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Error adding category.' });
    }
  };
  
  const getAllCategories = async (req, res) => {
    try { 
      const categories = await categoryTable.findAll();
      res.status(200).json({ message: 'Categories retrieved successfully.', data: categories });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Error getting categories.' });
    }
  };
  const getCategoryById = async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const category = await categoryTable.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.status(200).json({ message: 'Category retrieved successfully.', data: category });
    } catch (error) {
      console.error('Error getting category by ID:', error);
      res.status(500).json({ message: 'Error getting category.' });
    }
  };

  const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const updatedCategoryName = req.body.category_name;
  
    try {
      const category = await categoryTable.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      category.category_name = updatedCategoryName;
      await category.save();
  
      res.status(200).json({ message: 'Category updated successfully.', data: category });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category.' });
    }
  };
  

  const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const category = await categoryTable.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      await category.destroy();
      res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category.' });
    }
  };
  
  const addBanner = async (req, res) => {
    try {
  
      let image1 = null;
      let image2 = null;
      let image3 = null;
  
      // Check if all three images are provided
      if (req.files.image1 && req.files.image2 && req.files.image3) {
        image1 = req.files.image1[0].path;
        image2 = req.files.image2[0].path;
        image3 = req.files.image3[0].path; 
      } else {
        return res.status(400).json({ error: 'All three images are required.' });
      }
  
      // Create a new banner entry in the database
      const newBanner = await db.banner.create({
        image1,
        image2,
        image3,
        banner_id: 1,
        // user_id: userId, // assuming you have a user_id field in your banner model
      });
      await newBanner.save();
  
      res.status(201).json({ message: 'Banner added successfully.', data: newBanner });
    } catch (error) {
      console.error('Error adding banner:', error);
      res.status(500).json({ message: 'Error adding banner.' });
    }
  };
  
  


  const updateBanner = async (req, res) => {
    try {
      const { image1, image2, image3 } = req.files;
  
      // Find the last existing banner with banner_id = 1
      const lastBanner = await db.banner.findOne({
        where: { banner_id: 1 },
        order: [['createdAt', 'DESC']], // Get the last entry based on creation date
      });
  
      if (!lastBanner) {
        return res.status(404).json({ message: 'No banner found for the specified banner_id.' });
      }
  
      // Update the images for the last banner
      lastBanner.image1 = image1 ? image1[0].filename : lastBanner.image1;
      lastBanner.image2 = image2 ? image2[0].filename : lastBanner.image2;
      lastBanner.image3 = image3 ? image3[0].filename : lastBanner.image3;
  
      // Save the changes to the database
      await lastBanner.save();
  
      res.status(200).json({ message: 'Banner updated successfully.', data: lastBanner });
    } catch (error) {
      console.error('Error updating banner:', error);
      res.status(500).json({ message: 'Error updating banner.' });
    }
  };
  
  const getBanner = async (req, res) => {
    try {
      const getBanner = await db.banner.findOne({
        where: { banner_id: 1 },
        order: [['createdAt', 'DESC']]
         
      });
  
      if (!getBanner) {
        return res.status(404).json({ message: 'Active announcement form not found.' });
      }
  
      res.status(200).json({ data: getBanner });
    } catch (error) {
      console.error('Error fetching getBanner form:', error);
      res.status(500).json({ message: 'Error fetching getBanner form.' });
    }
  };


  const addProduct = async (req, res) => {
    try {
      let category_id = req.params.id;
  
      const { name, courseBook, rs, instock } = req.body;
      let image = null;
      if (req.file) {
        // Generate a unique filename based on the current date and time
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const fileExtension = req.file.originalname.split('.').pop();
        image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
        
        const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);
  
        if (!imageUploadSuccess) {
          return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
        } 
      }
  
  
      if (!name || !rs || !instock) {
        return res.status(400).json({ message: 'Name, Rs, and Instock are required fields.' });
      }
  
      const category = await categoryTable.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ message: 'Invalid categoryId. Category not found.' });
      }
  
      // Create the new product
      const newProduct = await product.create({
        name: name,
        courseBook: courseBook,
        category_id: category_id,
        rs: rs,
        instock: instock,
        image:`https://divinestorage.blob.core.windows.net/${containerName}/${image}`

      });
  
      // Send success response
      return res.status(201).json({ message: 'Product created successfully.', data: newProduct });
    } catch (error) {
      // Handle specific Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      // Handle other errors
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Error creating product.', error: error.message });
    }
  };
  
  
  const getProductbyID = async (req, res) => {
    const productId = req.params.id;
    try {
      const Product = await product.findByPk(productId);
      if (!Product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      return res.status(200).json({ data: Product });
    } catch (error) {
      console.error('Error retrieving product by ID:', error);
      return res.status(500).json({ message: 'Error retrieving product by ID.', error: error.message });
    }
  };

  const getProductbyCategoryID = async (req, res) => { 
    const categoryId = req.params.category_id;
    try {
      // Validate categoryId
      const category = await categoryTable.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Invalid categoryId. Category not found.' });
      }
  
      // Retrieve products by category_id
      const products = await product.findAll({
        where: {
          category_id: categoryId,
        },
      });
  
      return res.status(200).json({ data: products });
    } catch (error) {
      console.error('Error retrieving products by category ID:', error);
      return res.status(500).json({ message: 'Error retrieving products by category ID.', error: error.message });
    }
  };
  
  const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, courseBook, categoryId, rs, instock, image } = req.body;
    try {
      const products = await product.findByPk(productId);
      if (!products) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      product.name = name;
      product.courseBook = courseBook;
      product.category_id = categoryId;
      product.rs = rs;
      product.instock = instock;
      product.image = image;
  
      // Save updated product
      await products.save();
  
      return res.status(200).json({ message: 'Product updated successfully.', data: product });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Error updating product.', error: error.message });
    }
  };
  
    const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
      const products = await product.findByPk(productId);
      if (!products) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      // Delete the product
      await products.destroy();
  
      return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Error deleting product.', error: error.message });
    }
  };


  const getAllCategoryWithProduct = async (req, res) => {
    try {
      // Assuming you have models defined for 'Category' and 'Product'
      const categories = await categoryTable.findAll({
        include: [{
          model: newProduct, // Assuming newProduct is your Product model
          as: 'newProductTables', // Use the correct casing for the alias
        }],
      });
  
      res.status(200).json({ message: 'Categories retrieved successfully.', data: categories });
    } catch (error) {
      console.log("Error getting all categories with products", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  
  
  
  const addUnit = async(req,res)=>{
    try {
      const unit = req.body.unit

      ;if(!unit){
        res.status(400).json({ message: 'unit are required fields.' }) 
         }
          const result =await units.create({name:unit
          })
          return res.status(201).json({ message: 'unit created successfully.', data: result });

      
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      // Handle other errors
      console.error('Error creating unit:', error);
      return res.status(500).json({ message: 'Error creating unit.', error: error.message });
      
    }

  }

  const getAllUnit =async (req,res)=>{
    try {
      const allUnits= await units.findAll()
      return res.status(200).json({ message: 'All units fetched successfully.', data: allUnits });

    } catch (error) {
      console.error('Error fetching units:', error);
      return res.status(500).json({ message: 'Error fetching units'})
      
    }

  }

  const getOneUnit =async (req,res)=>{
    try {
      const unitId = req.params.unit_id
      const findUnit= await units.findByPk(unitId)   
      if(!findUnit){
        return res.status(200).json({ message: 'unit not find sorry' });
}   
      return res.status(200).json({ message: 'units fetched successfully sorry', data: findUnit });

    } catch (error) {
      console.error('Error fetching units:', error);
      return res.status(500).json({ message: 'Error fetching units'})
      
    }

  }
  
  const updateUnit = async(req,res)=>{
    try {
      const unitId = req.params.unit_id
      const unitName = req.body.unit
      const findUnit= await units.findByPk(unitId)
      if(!findUnit){
        return res.status(200).json({ message: 'unit not find' });
}
findUnit.name =unitName
      await findUnit.save()
      return res.status(200).json({ message: 'unit updated successfully.', data: product });
    
  } catch (error) {
    console.error('Error fetching units:', error);
      return res.status(500).json({ message: 'Error fetching units'})
    
  }

  }

  const deleteUnit= async(req,res)=>{
    try {
      const Unit_id = req.params.unit_id 
      if (!Unit_id) {
        return res.status(400).json({ message: 'Unit id is required'
        });
        
      }
      const findUnit = await units.findByPk(Unit_id)
      if (!findUnit) {
        return res.status(404).json({ message: 'Unit not found'
        });
      }
      await findUnit.destroy()
      return res.status(200).json({ message: 'unit delete successfully.', data: product });


      
    } catch (error) {
      console.error('Error deleting unit:', error);
      return res.status(500).json({ message: 'Error deleting unit.', error: error.message });
    }

  }


  const addSuppliers = async (req, res) => {
    try {
      const supplier_name = req.body.supplier_name;
      const supplier_email = req.body.supplier_email;
      const supplier_Mobile = req.body.supplier_Mobile;
      const supplierAddress = req.body.supplierAddress;
      const supplierState = req.body.supplierState;
      const supplierPinCode = req.body.supplierPinCode;

      let image = null;
  
      if (req.file) {
        image = req.file.path;
      }
  
      const newSuppliers = await suppliers.create({
        supplier_name,
        supplier_email,
        supplier_Mobile,
        supplierAddress,
        supplierState,
        supplierPinCode,
        supplier_image:image,
      });
  
      return res.status(201).json({ message: 'Product created successfully.', data: newSuppliers });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Error creating product.', error: error.message });
    }
  };

  const getSupplier = async (req, res) => {
    try {
      const id = req.params.supplier_id;
  
      const supplierDetail = await suppliers.findByPk(id); // Corrected line
      if(!supplierDetail){
        return res.status(200).json({ message: ' supplier not found.' });

      }
      return res.status(200).json({ message: 'All supplierDetail fetched successfully.', data: supplierDetail });
      } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error getting supplier details:', error);
      return res.status(500).json({ message: 'Error getting supplier details.', error: error.message });
    }
  };

  const getAllSupplier = async (req, res) => {
    try {
      // const id = req.params.supplier_id;
  
      const supplierDetail = await suppliers.findAll(); // Corrected line
      return res.status(200).json({ message: 'All supplierDetail fetched successfully.', data: supplierDetail });
      } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error getting supplier details:', error);
      return res.status(500).json({ message: 'Error getting supplier details.', error: error.message });
    }
  };

  const updateSupplier = async (req, res) => {
    try {
      const physical_Pooja_id = req.params.supplier_id;
  
      // Check if the supplier exists
      const existingSupplier = await suppliers.findByPk(physical_Pooja_id);
  
      if (!existingSupplier) {
        return res.status(404).json({ message: 'Supplier not found.' });
      }
  
      // Extract update payload from the request body
      const {
        supplier_name,
        supplier_email,
        supplier_Mobile,
        supplierAddress,
        supplierState,
        supplierPinCode,
      } = req.body;
  
      // Extract updated image path if a new image is provided
      let updatedImage = existingSupplier.supplier_image;
  
      if (req.file) {
        updatedImage = req.file.path;
      }
  
      // Perform the update
      await existingSupplier.update({
        supplier_name,
        supplier_email,
        supplier_Mobile,
        supplierAddress,
        supplierState,
        supplierPinCode,
        supplier_image: updatedImage,
      });
  
      // Fetch the updated supplier details
      const updatedSupplier = await suppliers.findByPk(physical_Pooja_id);
  
      return res.status(200).json({ message: 'Supplier updated successfully.', data: updatedSupplier });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error updating supplier:', error);
      return res.status(500).json({ message: 'Error updating supplier.', error: error.message });
    }
  };

  const deleteSupplier = async (req, res) => {
    try {
      const physical_Pooja_id = req.params.supplier_id;
  
      const existingSupplier = await suppliers.findByPk(physical_Pooja_id);
  
      if (!existingSupplier) {
        return res.status(404).json({ message: 'Supplier not found.' });
      }
  
      await existingSupplier.destroy();
  
      return res.status(200).json({ message: 'Supplier deleted successfully.' });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      return res.status(500).json({ message: 'Error deleting supplier.', error: error.message });
    }
  };

  const addPhysicalPooja = async (req, res) => {
    try {
      const name = req.body.name;
      const price = req.body.price;
      let image = null;
      if (req.file) {
        // Generate a unique filename based on the current date and time
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const fileExtension = req.file.originalname.split('.').pop();
        image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
        
        const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);
  
        if (!imageUploadSuccess) {
          return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
        } 
      }
  
      // Pass the correct file to the upload function

  
      const newSuppliers = await PhysicalPooja.create({
        name,
        price,
        image: `https://divinestorage.blob.core.windows.net/${containerName}/${image}`,
      });
  
      return res.status(201).json({ message: 'Pooja created successfully.', data: newSuppliers });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error creating Pooja:', error);
      return res.status(500).json({ message: 'Error creating Pooja.', error: error.message });
    }
  };


  const getPhysicalPooja = async (req, res) => {
    try {
      const id = req.params.physical_Pooja_id;
  
      const physicalPoojaDetail = await PhysicalPooja.findByPk(id); // Corrected line
      if(!physicalPoojaDetail){
        return res.status(200).json({ message: ' supplier not found.' });

      }
      return res.status(200).json({ message: 'All physicalPoojaDetail fetched successfully.', data: physicalPoojaDetail });
      } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error getting physicalPoojaDetail details:', error);
      return res.status(500).json({ message: 'Error getting physicalPoojaDetail details.', error: error.message });
    }
  };

  const getAllPhysicalPooja = async (req, res) => {
    try {
  
      const physicalPoojaDetail = await PhysicalPooja.findAll(); // Corrected line
      if(!physicalPoojaDetail){
        return res.status(200).json({ message: ' supplier not found.' });

      }
      return res.status(200).json({ message: 'All physicalPoojaDetail fetched successfully.', data: physicalPoojaDetail });
      } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error getting physicalPoojaDetail details:', error);
      return res.status(500).json({ message: 'Error getting physicalPoojaDetail details.', error: error.message });
    }
  };


  const updatePhysicalPooja = async (req, res) => {
    try {
      const physical_Pooja_id = req.params.physical_Pooja_id;
  
      // Check if the supplier exists
      const existphysicalPoojaDetail = await PhysicalPooja.findByPk(physical_Pooja_id); // Corrected line
      if(!existphysicalPoojaDetail){
        return res.status(200).json({ message: ' physical_Pooja_id not found.' });

      }
  
      // Extract update payload from the request body
      const {
        name,
        price,
      } = req.body;
  
      // Extract updated image path if a new image is provided
      let updatedImage = existphysicalPoojaDetail.image;
  
      if (req.file) {
        updatedImage = req.file.filename;
      }
      const imageUploadSuccess = await uploadFileToAzure(req.file.path, updatedImage);

      if (!imageUploadSuccess) {
        return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
      }
  
      // Perform the update
      await existphysicalPoojaDetail.update({
        name,
        price,
        image:`https://divinestorage.blob.core.windows.net/${containerName}/${updatedImage}`      });
  
      // Fetch the updated supplier details
      const updatedPhysicalPooja = await PhysicalPooja.findByPk(physical_Pooja_id);
  
      return res.status(200).json({ message: 'Supplier updated successfully.', data: updatedPhysicalPooja });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error updating supplier:', error);
      return res.status(500).json({ message: 'Error updating supplier.', error: error.message });
    }
  };




  const deletePhysicalPooja = async (req, res) => {
    try {
      const id = req.params.physical_Pooja_id;
  
      const physicalPoojaDetail = await PhysicalPooja.findByPk(id); // Corrected line
      if(!physicalPoojaDetail){
        return res.status(200).json({ message: ' physical pooja not found.' });

      }
      await physicalPoojaDetail.destroy();
  
      return res.status(200).json({ message: 'physical pooja deleted successfully sorrryyyyyyyy' });      } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
  
      console.error('Error getting physicalPoojaDetail details:', error);
      return res.status(500).json({ message: 'Error getting physicalPoojaDetail details.', error: error.message });
    }
  };


  const addmantras = async (req, res) => {
    try {
      const { title, artist, details } = req.body;
      const imageFile = req.files && req.files['image'] ? req.files['image'][0].filename : null;
      const audioFile = req.files && req.files['audio'] ? req.files['audio'][0].filename : null;
  
      // Check if files are present
      if (!imageFile || !audioFile) {
        return res.status(400).json({ message: 'Both image and audio files are required.' });
      }
  
      // Generate a unique filename for the image based on the current date and time
      const imageTimestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const imageFileExtension = req.files['image'][0].originalname.split('.').pop();
      const modifiedImageFile = `${imageTimestamp}-${imageFile.replace(/\s/g, '')}.${imageFileExtension}`;
  
      // Generate a unique filename for the audio based on the current date and time
      const audioTimestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const audioFileExtension = req.files['audio'][0].originalname.split('.').pop();
      const modifiedAudioFile = `${audioTimestamp}-${audioFile.replace(/\s/g, '')}.${audioFileExtension}`;
  
      const imageUploadSuccess = await uploadFileToAzure(req.files['image'][0].path, modifiedImageFile);
      const audioUploadSuccess = await uploadFileToAzure(req.files['audio'][0].path, modifiedAudioFile);
  
      if (!imageUploadSuccess || !audioUploadSuccess) {
        return res.status(500).json({ message: 'Error uploading files to Azure Blob Storage.' });
      }
  
      const newMantras = await mantras.create({
        title,
        artWork: `https://divinestorage.blob.core.windows.net/${containerName}/${modifiedImageFile}`,
        URL: `https://divinestorage.blob.core.windows.net/${containerName}/${modifiedAudioFile}`,
        artist,
        details,
      });
  
      return res.status(201).json({ message: 'Mantras created successfully.', data: newMantras });
    } catch (error) {
      console.error('Error creating mantras:', error);
      return res.status(500).json({ message: 'Error creating mantras.', error: error.message });
    }
  };
  



  
  const getAllMantras = async(req,res)=>{
    try {

      const mantrasData = await mantras.findAll()
      if(!mantrasData){
        return res.status(200).json({ message: ' mantras not found.' });
      }
      return res.status(200).json({ message: 'All mantras fetched successfully.', data: mantrasData });

      
    } catch (error) {
      console.error('Error fetching mantras:', error);
      return res.status(500).json({ message: 'Error fetching mantras.', error: error.message });
    }

  }


  const getAllMantrasForBuild = async (req, res) => {
    try {
      const mantrasData = await mantras.findAll();
  
      if (!mantrasData) {
        return res.status(200).json({ message: 'Mantras not found.' });
      }
  
      // Transform the data to the desired format
      const formattedMantras = mantrasData.map((mantra) => ({
        id: mantra.mantras_id,
        title: mantra.title,
        artist: mantra.artist,
        album: '', // You can set the album field as needed
        artwork: mantra.artWork,
        url: mantra.URL,
      }));
  
      return res.status(200).json({ message: 'All mantras fetched successfully.', data: formattedMantras });
    } catch (error) {
      console.error('Error fetching mantras:', error);
      return res.status(500).json({ message: 'Error fetching mantras.', error: error.message });
    }
  };
  


  const getMantra = async(req,res)=>{
    try {
      const id = req.params.mantras_id
      const mantrasData = await mantras.findOne({where:{mantras_id:id}})
      if(!mantrasData){
        return res.status(404).json({ message: ' Mantras not found' })
        }
        return res.status(200).json({ message: ' Mantras fetched successfully.', data: mantrasData})
        

      
    } catch (error) {
      console.error('Error fetching mantras:', error);
      return res.status(500).json({ message: 'Error fetching mantras.', error: error.message });
      
    }

  }
  const updateMantras = async (req, res) => {
    try {
      const id = req.params.mantras_id
      const { title, artist, details } = req.body;
      
      const existingMantras = await mantras.findOne({where:{mantras_id:id}});
      if (!existingMantras) {
        return res.status(404).json({ message: 'Mantras not found.' });
      }
  
      const updatedMantras = await existingMantras.update({
        title,  
        artist,
        details,
      });
  
      return res.status(200).json({ message: 'Mantras updated successfully.', data: updatedMantras });
    } catch (error) {
      console.error('Error updating mantras:', error);
      return res.status(500).json({ message: 'Error updating mantras.', error: error.message });
    }
  };



  


  const deleteMantras = async (req, res) => {
    try {
       const id = req.params.mantras_id

  
      // Check if the mantra exists
      const existingMantra = await mantras.findOne({where:{mantras_id:id}});
  
      if (!existingMantra) {
        return res.status(404).json({ message: 'Mantra not found.' });
      }
  
      // Delete the mantra
      await existingMantra.destroy();
  
      return res.status(200).json({ message: 'Mantra deleted successfully.' });
    } catch (error) {
      console.error('Error deleting mantra:', error);
      return res.status(500).json({ message: 'Error deleting mantra.', error: error.message });
    }
  };


  // const  addNewProduct = async (req, res) => {
  //   try {
  //     const {
  //       name,
  //       price,
  //       quantity,
  //       unit_id,
  //       unitValue,
  //       category_id,
  //       productCode,
  //       purchasePrice,
  //       discountType,
  //       discount,
  //       supplier_id,
  //     } = req.body;
  
  //     // Check if the productCode already exists
  //     const existingProduct = await newProduct.findOne({
  //       where: { productCode: productCode },
  //     });
  
  //     if (existingProduct) {
  //       return res.status(400).json({ message: 'Product with this code already exists.' });
  //     }
  
  //     // Check if the category exists
  //     const existingCategory = await categoryTable.findByPk(category_id);
  //     if (!existingCategory) {
  //       return res.status(400).json({ message: 'Invalid category_id. Category not found.' });
  //     }
  
  //     // Check if the unit exists
  //     const existingUnit = await units.findByPk(unit_id);
  //     if (!existingUnit) {
  //       return res.status(400).json({ message: 'Invalid unit_id. Unit not found.' });
  //     }
  
  //     // Check if the supplier exists
  //     const existingSupplier = await suppliers.findByPk(supplier_id);
  //     if (!existingSupplier) {
  //       return res.status(400).json({ message: 'Invalid supplier_id. Supplier not found.' });
  //     }

  //     let image = null;
  //     if (req.file) {
  //       image = req.file.filename;
  //     }
  //     // const imagePath = path.join(__dirname, '..', 'public', 'image', image);

  //     // Create the new product
  //     const newProductInstance = await newProduct.create({
  //       name,
  //       price,
  //       quantity,
  //       unit_id,
  //       unitValue,
  //       category_id,
  //       productCode,
  //       purchasePrice,
  //       discountType,
  //       discount,
  //       supplier_id,
  //       // image:imagePath
  //       // image:`${'https://backend.divinezone.in'}/image/${image}`
  //       image:`${'http://143.110.188.54:7000'}/image/${image}`,

        
  //     });
      
  //     return res.status(201).json({ message: 'Product added successfully.', data: newProductInstance });
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //       if (error.name === 'SequelizeValidationError') {
  //       const errors = error.errors.map((err) => err.message);
  //       return res.status(400).json({ message: 'Validation error.', errors: errors });
  //     }
  //       return res.status(500).json({ message: 'Error adding product.', error: error.message });
  //   }
  // };


  const addNewProduct = async (req, res) => {
    try {
      const {
        name,
        price,
        quantity,
        unit_id,
        unitValue,
        category_id,
        productCode,
        purchasePrice,
        discountType,
        discount,
        supplier_id,
      } = req.body;
  
      // Check if the productCode already exists
      const existingProduct = await newProduct.findOne({
        where: { productCode: productCode },
      });
  
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this code already exists.' });
      }
  
      // Check if the category exists
      const existingCategory = await categoryTable.findByPk(category_id);
      if (!existingCategory) {
        return res.status(400).json({ message: 'Invalid category_id. Category not found.' });
      }
  
      // Check if the unit exists
      const existingUnit = await units.findByPk(unit_id);
      if (!existingUnit) {
        return res.status(400).json({ message: 'Invalid unit_id. Unit not found.' });
      }
  
      // Check if the supplier exists
      const existingSupplier = await suppliers.findByPk(supplier_id);
      if (!existingSupplier) {
        return res.status(400).json({ message: 'Invalid supplier_id. Supplier not found.' });
      }
  
      let image = null;
      if (req.file) {
        // Generate a unique filename based on the current date and time
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const fileExtension = req.file.originalname.split('.').pop();
        image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
        
        const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);
  
        if (!imageUploadSuccess) {
          return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
        }
      }
  
      // Create the new product
      const newProductInstance = await newProduct.create({
        name,
        price,
        quantity,
        unit_id,
        unitValue,
        category_id,
        productCode,
        purchasePrice,
        discountType,
        discount,
        supplier_id,
        image: `https://divinestorage.blob.core.windows.net/${containerName}/${image}`,
      });
  
      return res.status(201).json({ message: 'Product added successfully.', data: newProductInstance });
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ message: 'Validation error.', errors: errors });
      }
      return res.status(500).json({ message: 'Error adding product.', error: error.message });
    }
  };
  


const getnewProductDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const productDetails = await newProduct.findByPk(id);
    console.log(productDetails);

    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const { name, price, quantity, unit_id, unitValue, category_id, supplier_id, productCode, purchasePrice, discountType, discount, image } = productDetails;
    const [supplierName, unitName, categoryName] = await Promise.all([
      suppliers.findByPk(supplier_id).then((supplier) => (supplier ? supplier.supplier_name : null)),
      units.findByPk(unit_id).then((unit) => (unit ? unit.name : null)),
      categoryTable.findByPk(category_id).then((category) => (category ? category.name : null)),
    ]);
    const responseData = {
      name,
      price,
      quantity,
      unitValue,
      productCode,
      purchasePrice,
      discountType,
      discount,
      image,
      supplierName,
      unitName,
      categoryName,
    };
    return res.status(200).json({ message: 'Product details retrieved successfully.', data: responseData });
  } catch (error) {
    console.error('Error getting product details:', error);
    return res.status(500).json({ message: 'Error getting product details.', error: error.message });
  }
};



const getAllProductDetails = async (req, res) => {
  try {
    const products = await newProduct.findAll();

    const productList = await Promise.all(
      products.map(async (product) => {
        const {
          id,
          name,
          price,
          quantity,
          unit_id,
          unitValue,
          category_id,
          supplier_id,
          productCode,
          purchasePrice,
          discountType,
          discount,
          image,
        } = product;

        const [supplierName, unitName, categoryName] = await Promise.all([
          suppliers.findByPk(supplier_id).then((supplier) => (supplier ? supplier.supplier_name : null)),
          units.findByPk(unit_id).then((unit) => (unit ? unit.name : null)),
          categoryTable.findByPk(category_id).then((category) => (category ? category.name : null)),
        ]);

        return {
          id,
          name,
          price,
          quantity,
          unitValue,
          productCode,
          purchasePrice,
          discountType,
          discount,
          image,
          supplierName,
          unitName,
          categoryName,
        };
      })
    );

    // Send the product list as a response
    return res.status(200).json({ message: 'Products retrieved successfully.', data: productList });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({ message: 'Error getting products.', error: error.message });
  }
};

const updateProductDetails = async (req, res) => {
  try {
    console.log(req);
    console.log(req.body);

    const productId = req.params.product_id;
  
    const existingProduct = await newProduct.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const {
      name,
      price,
      quantity,
      unit_id,
      unitValue,
      category_id,
      productCode,
      purchasePrice,
      discountType,
      discount,
      supplier_id,
    } = req.body;
    const updatedProductDetails = await existingProduct.update({
      name,
      price,
      quantity,
      unit_id,
      unitValue,
      category_id,
      productCode,
      purchasePrice,
      discountType,
      discount,
      supplier_id,

    });
    return res.status(200).json({ message: 'Product details updated successfully.', data: updatedProductDetails });
  } catch (error) {
    console.error('Error updating product details:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      return res.status(400).json({ message: 'Validation error.', errors: errors });
    }
    return res.status(500).json({ message: 'Error updating product details.', error: error.message });
  }
};


const deleteMainProduct = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const existingProduct = await newProduct.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    await existingProduct.destroy();
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: ' Error deleting product.', error: error.message });
  }
};


async function getAllPreist(req, res) {
  try {
    const allPreistinfo = await preistModel.findAll();
    
    if (!allPreistinfo) {
      return res.status(401).json({ message: 'No pandit found' });
    } else {
      return res.status(200).json({ message: 'Pandit fetched successfully', data: allPreistinfo });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  
}


async function getPriestInfo(req, res) {
  try {
    
const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: 'send pandit id' });
    }

    // Retrieve preist information from the database based on preistId
    const preist = await preistModel.findOne({ where: { id: id } });

    if (preist) {
      res.status(200).json(preist);
    } else {
      res.status(404).json({ message: 'pandit not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function updatePriestByAdmin(req, res) {
  try {

    const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: 'send pandit id' });
    }

    const { name, skills, House_no, building, area, city, pincode, state, user_id } = req.body;

    // Check if skills is a comma-separated string, convert it to an array
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',');

    // Fetch the priest's information by ID
    const priest = await preistModel.findOne({ where: { id: id } });

    if (!priest) {
      return res.status(404).json({ message: 'Priest not found' });
    }

    // Update the priest's information
    await priest.update({
      name,
      skills: skillsArray, 
      House_no,
      building,
      area,
      city,
      pincode,
      state,
      user_id,
    });

    res.status(200).json(priest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function deletePanditByAdmin(req,res){
  try {

    const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: 'send pandit id' });
    }
    const priest = await preistModel.findOne({ where: { id: id } });

    if (!priest) {
      return res.status(404).json({ message: 'Priest not found' });
    }else{
      await priest.destroy()
      return res.status(200).json({ message: 'Priest deleted successfully.' });

    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    
  }

}


const getNewProductbyID = async (req, res) => {
  const productId = req.params.id;
  try {
    const Product = await newProduct.findByPk(productId);
    if (!Product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ data: Product });
  } catch (error) {
    console.error('Error retrieving product by ID:', error);
    return res.status(500).json({ message: 'Error retrieving product by ID.', error: error.message });
  }
};

const addVirtualPooja = async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;

    let image = null;
    if (req.file) {
      // Generate a unique filename based on the current date and time
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const fileExtension = req.file.originalname.split('.').pop();
      image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
      
      const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);

      if (!imageUploadSuccess) {
        return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
      }
    }

    const newPooja = await virtualPooja.create({
      name,
      price,
      image: `https://divinestorage.blob.core.windows.net/${containerName}/${image}`,
    });

    return res.status(201).json({ message: 'Pooja created successfully.', data: newPooja });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      return res.status(400).json({ message: 'Validation error.', errors: errors });
    }

    console.error('Error creating Pooja:', error);
    return res.status(500).json({ message: 'Error creating Pooja.', error: error.message });
  }
};




const getAllVirtualPoojas = async (req, res) => {
  try {
    // Assuming virtualPooja is your Sequelize model for virtual poojas
    const allPoojas = await virtualPooja.findAll();
    return res.status(200).json({ message: 'All Virtual Poojas retrieved successfully.', data: allPoojas });
  } catch (error) {
    console.error('Error getting all Virtual Poojas:', error);
    return res.status(500).json({ message: 'Error getting all Virtual Poojas.', error: error.message });
  }
};

const getVirtualPoojaById = async (req, res) => {
  try {
    const virtual_Pooja_id = req.params.id; // Assuming you pass the ID as a route parameter

    // Assuming virtualPooja is your Sequelize model for virtual poojas
    const pooja = await virtualPooja.findByPk(virtual_Pooja_id);

    if (!pooja) {
      return res.status(404).json({ message: 'Virtual Pooja not found.' });
    }

    return res.status(200).json({ message: 'Virtual Pooja retrieved successfully.', data: pooja });
  } catch (error) {
    console.error('Error getting Virtual Pooja by ID:', error);
    return res.status(500).json({ message: 'Error getting Virtual Pooja by ID.', error: error.message });
  }
};
const updateVirtualPoojaById = async (req, res) => {
  try {
    const poojaId = req.params.id;
    const { name, price } = req.body;

    // Assuming virtualPooja is your Sequelize model for virtual poojas
    const existingPooja = await virtualPooja.findByPk(poojaId);

    if (!existingPooja) {
      return res.status(404).json({ message: 'Virtual Pooja not found.' });
    }

    if (req.file) {
      // Update the image if a new file is provided
      const imageUploadSuccess = await uploadFileToAzure(req.file.path, req.file.filename);

      if (!imageUploadSuccess) {
        return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
      }

      existingPooja.image = `https://divinestorage.blob.core.windows.net/${containerName}/${req.file.filename}`;
    }

    // Update other properties
    existingPooja.name = name || existingPooja.name;
    existingPooja.price = price || existingPooja.price;

    await existingPooja.save();

    return res.status(200).json({ message: 'Virtual Pooja updated successfully.', data: existingPooja });
  } catch (error) {
    console.error('Error updating Virtual Pooja by ID:', error);
    return res.status(500).json({ message: 'Error updating Virtual Pooja by ID.', error: error.message });
  }
};
var { BlobServiceClient } = require("@azure/storage-blob");

const deleteVirtualPoojaById = async (req, res) => {
  try {
    const poojaId = req.params.id;

    // Assuming virtualPooja is your Sequelize model for virtual poojas
    const existingPooja = await virtualPooja.findByPk(poojaId);

    if (!existingPooja) {
      return res.status(404).json({ message: 'Virtual Pooja not found.' });
    }
    const connectionString = "DefaultEndpointsProtocol=https;AccountName=divinestorage;AccountKey=PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==;EndpointSuffix=core.windows.net";

    const containerClient = BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName);

    // Delete the image from Azure Blob Storage (optional)
    if (existingPooja.image) {
      const blobClient = containerClient.getBlobClient(existingPooja.image.split('/').pop());
      await blobClient.delete();
    }


    await existingPooja.destroy();

    return res.status(200).json({ message: 'Virtual Pooja deleted successfully.' });
  } catch (error) {
    console.error('Error deleting Virtual Pooja by ID:', error);
    return res.status(500).json({ message: 'Error deleting Virtual Pooja by ID.', error: error.message });
  }
};


const addmantrasCategory = async (req, res) => {
  try {
    // const { category_name, details } = req.body;
    const category_name = req.body.category_name
    const details = req.body.details

    let image = null;
    if (req.file) {
      // Generate a unique filename based on the current date and time
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const fileExtension = req.file.originalname.split('.').pop();
      image = `${timestamp}-${req.file.filename.replace(/\s/g, '')}.${fileExtension}`;
      
      const imageUploadSuccess = await uploadFileToAzure(req.file.path, image);

      if (!imageUploadSuccess) {
        return res.status(500).json({ message: 'Error uploading image to Azure Blob Storage.' });
      }
    }

    const newMantras = await manras_Category.create({
      category_name:category_name,
      details:details,
      image: `https://divinestorage.blob.core.windows.net/${containerName}/${image}`,
 
    });

    return res.status(201).json({ message: 'Mantras created successfully.', data: newMantras });
  } catch (error) {
    console.error('Error creating mantras:', error);
    return res.status(500).json({ message: 'Error creating mantras.', error: error.message });
  }
};


const getAllMantrasCategory = async (req, res) => {
  try {
    const allMantras = await manras_Category.findAll();
    return res.status(200).json({ data: allMantras });
  } catch (error) {
    console.error('Error fetching all mantras:', error);
    return res.status(500).json({ message: 'Error fetching all mantras.', error: error.message });
  }
};

// Get mantra by ID
const getMantraCategoryById = async (req, res) => {
  try {
    const mantraId = req.params.category_id;
    const mantra = await manras_Category.findByPk(mantraId);

    if (!mantra) {
      return res.status(404).json({ message: 'Mantra not found.' });
    }

    return res.status(200).json({ data: mantra });
  } catch (error) {
    console.error('Error fetching mantra by ID:', error);
    return res.status(500).json({ message: 'Error fetching mantra by ID.', error: error.message });
  }
};

// Update mantra by ID
const updateMantraCategoryById = async (req, res) => {
  try {
    const mantraId = req.params.category_id;
    const { category_name, details } = req.body;

    const updatedMantra = await manras_Category.update(
      { category_name, details },
      { where: { category_id: mantraId } }
    );

    if (!updatedMantra[0]) {
      return res.status(404).json({ message: 'Mantra not found.' });
    }

    const updatedData = await manras_Category.findByPk(mantraId);
    return res.status(200).json({ message: 'Mantra updated successfully.', data: updatedData });
  } catch (error) {
    console.error('Error updating mantra by ID:', error);
    return res.status(500).json({ message: 'Error updating mantra by ID.', error: error.message });
  }
};
// Delete mantra by ID
const deleteMantraByCategoryId = async (req, res) => {
  try {
    const mantraId = req.params.category_id;
    const deletedMantra = await manras_Category.destroy({ where: { category_id: mantraId } });

    if (!deletedMantra) {
      return res.status(404).json({ message: 'Mantra not found.' });
    }

    return res.status(200).json({ message: 'Mantra deleted successfully.' });
  } catch (error) {
    console.error('Error deleting mantra by ID:', error);
    return res.status(500).json({ message: 'Error deleting mantra by ID.', error: error.message });
  }
};





  module.exports = {addCategory,getAllCategories,getCategoryById,getAllCategories,updateCategory,deleteCategory,addBanner,updateBanner,getBanner,
    addProduct,getProductbyID,getProductbyCategoryID,updateProduct,deleteProduct,addUnit,getAllUnit,updateUnit,deleteUnit,addSuppliers,getSupplier,getAllSupplier
    ,updateSupplier,deleteSupplier,addPhysicalPooja,getPhysicalPooja,getAllPhysicalPooja,updatePhysicalPooja,addmantras,getAllMantras,getMantra,
    updateMantras,deleteMantras,addNewProduct,getnewProductDetails,getAllProductDetails,updateProductDetails,deleteMainProduct,deletePhysicalPooja
    ,getOneUnit,getAllPreist,getPriestInfo,updatePriestByAdmin,deletePanditByAdmin,getAllCategoryWithProduct,getNewProductbyID,getAllMantrasForBuild,
    addVirtualPooja,updateVirtualPoojaById,getVirtualPoojaById,getAllVirtualPoojas,deleteVirtualPoojaById,addmantrasCategory,getAllMantrasCategory,
    getMantraCategoryById,updateMantraCategoryById,deleteMantraByCategoryId}