const { BlobServiceClient } = require("@azure/storage-blob");
// const mantras = require("path/to/mantras"); // Import your mantras module or replace it with the actual import path

const connectionString = "DefaultEndpointsProtocol=https;AccountName=divinestorage;AccountKey=PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==;EndpointSuffix=core.windows.net";
const containerName = "public"; // Replace with your container name

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadFileToAzure(filePath, blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    await blockBlobClient.uploadFile(filePath);
    // console.log(`File uploaded successfully: ${blobName}`);
    return true;
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    return false;
  }
}





// module.exports = { uploadFileToAzure };
// // PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==
// const { BlobServiceClient } = require("@azure/storage-blob");

// const sasToken = "?sv=2020-08-04&ss=b&srt=sco&sp=r&se=2022-01-14T08:00:00Z&st=2022-01-14T00:00:00Z&spr=https&sig=1stlJUE1jJy6TBuMb3X5DN5d3CgRK%2BOvDCH9VlQILnc%3D";

// const containerName = "public"; // Replace with your container name

// const blobServiceClientWithSAS = new BlobServiceClient(`https://divinestorage.blob.core.windows.net${sasToken}`);
// const containerClient = blobServiceClientWithSAS.getContainerClient(containerName);

// async function uploadFileToAzure(filePath, blobName) {
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//   try {
//     await blockBlobClient.uploadFile(filePath);
//     console.log(`File uploaded successfully: ${blobName}`);
//     return true;
//   } catch (error) {
//     console.error(`Error uploading file: ${error}`);
//     return false;
//   }
// }


// module.exports = {uploadFileToAzure}
















// const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");

// const connectionString = "DefaultEndpointsProtocol=https;AccountName=divinestorage;AccountKey=PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==;EndpointSuffix=core.windows.net";
// const containerName = "public";

// const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// async function uploadFileToAzure(filePath, blobName) {
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   try {
//     await blockBlobClient.uploadFile(filePath);
//     console.log(`File uploaded successfully: ${blobName}`);

//     // Set the permissions for the SAS token (e.g., read)
//     const permissions = {
//       read: true,
//       write: true,
//       delete: true,    };

//     // Set the expiry time for the SAS token (e.g., valid for 1 hour)
//     const expiryDate = new Date();
//     expiryDate.setHours(expiryDate.getHours() + 1);

//     // Generate the SAS token
//     const sasToken = generateBlobSASQueryParameters({
//       containerName: containerName,
//       blobName: blobName,
//       permissions: permissions,
//       expiresOn: expiryDate,
//     }).toString();

//     // Create the full URL with SAS token
//     const blobUrlWithSAS = `${blockBlobClient.url}?${sasToken}`;
//     console.log('Blob URL with SAS token:', blobUrlWithSAS);

//     return true;
//   } catch (error) {
//     console.error(`Error uploading file: ${error}`);
//     return false;
//   }
// }


 

// const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");

// const accountName = "divinestorage";
//  const accountKey = "PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==";  // Replace with your actual account key
// // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
// const connectionString = "DefaultEndpointsProtocol=https;AccountName=divinestorage;AccountKey=PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==;EndpointSuffix=core.windows.net";

//  const containerName = "public";


// // const connectionString = "DefaultEndpointsProtocol=https;AccountName=divinestorage;AccountKey=PFQfSudd7UxIG6VxZiwG6XY62w5gX6JEFVWW1ns/UuAhGOpfvZNM1mLZjvQ/ahZ6yv5gwwg4zcF5+AStVO60uw==;EndpointSuffix=core.windows.net";
// // const containerName = "public"; // Replace with your container name

// // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);



// // const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
// // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString, sharedKeyCredential);
// const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);


// const containerClient = blobServiceClient.getContainerClient(containerName);

// async function uploadFileToAzure(filePath, blobName) {
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
//   try {
//     await blockBlobClient.uploadFile(filePath);
//     console.log(`File uploaded successfully: ${blobName}`);

//     // Set the permissions for the SAS token (e.g., read)
//     const permissions = {
//       read: true,
//     };

//     // Set the expiry time for the SAS token (e.g., valid for 1 hour)
//     const expiryDate = new Date();
//     expiryDate.setHours(expiryDate.getHours() + 1);

//     // Generate the SAS token
//     const sasToken = generateBlobSASQueryParameters({
//       containerName: containerName,
//       blobName: blobName,
//       permissions: permissions,
//       expiresOn: expiryDate,
//     }).toString();

//     // Create the full URL with SAS token
//     const blobUrlWithSAS = `${blockBlobClient.url}?${sasToken}`;
//     console.log('Blob URL with SAS token:', blobUrlWithSAS);

//     return true;
//   } catch (error) {
//     console.error(`Error uploading file: ${error}`);
//     return false;
//   }
// }



module.exports = { uploadFileToAzure };















