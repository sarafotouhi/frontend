require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const multer  = require('multer');
const fs=require('fs');

const app = express();

const storage = multer.diskStorage({
    destination : 'uploads/', //send the files uploaded to the destination 
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//setting up the AWS variables 
AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY, // the enviroment variable containg the access key from AWS 
    secretAccessKey: process.env.REACT_APP_SECRET_KEY, //the enviroment varibale containing the secret key from AWS 
    region: 'us-east-1', //region of AWS S3 bucket being used 
});




const s3 = new AWS.S3();
app.use(fileUpload());

app.post('/upload', (req, res) => {


  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  var path = require('path');
  var ext = path.extname(`${file.name}`); //extracting the extention from the file 

  // const documentInformation = {
  //   documentName: file.name,
  //   orginazation: 'test-organization',
  //   workspace: 'test-workspace'
  //   s3FilePath: 'test-organization/test-workspace/contracts/'+file.name,
  //   s3BucketName: 'capstone-data-bucket'
  // }

  if(ext == '.pdf'){ //checks if the document to be uploaded is a pdf
    const params = {
      Body: Buffer.from(file.data), //getting the file data into aws 
      Bucket: 'capstone-data-bucket', // bucket name for the file to be added 
      Key: 'test-organization/test-workspace/contracts/'+file.name, //key name for the file to be added 

    }
    s3.putObject(params)
      .send((err) => {
         if (err) {
           // handle the error here
           console.log({'err':err}); //show an error message if there is problem reading the file 
         }
        // else{
        //   console.log('file successfully uploaded to the aws!');
        //   let response = await fetch(process.env.REACT_APP_AWS_API + '/document', documentInformation);

           
        // }
      })
  }
  
  else{
    return res.status(400).json({ msg: 'File not uploaded. Please upload a pdf file' }); //if the file is not pdf then it is not uploaded 
  }
});

app.get('/get_file/:file_name',(req,res)=>{ //get methord to retrive the file 
  retrieveFile(req.params.file_name, res);
});

app.listen(5000, () => console.log('Server Started...')); //server started 