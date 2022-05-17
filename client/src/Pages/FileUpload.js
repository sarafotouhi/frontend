/** This program is upload file from the upload from the front end UI to the aws server 
 */

//you can find that the file upload works perfectly on the local machine & currently gives a 405 errors if the code is hosted on the AWS server
// see this supplement documentation for more information - https://uwoca-my.sharepoint.com/:w:/r/personal/cowen23_uwo_ca/_layouts/15/Doc.aspx?sourcedoc=%7B3A2F4243-D489-49B1-AA87-6BB60A4970DC%7D&file=Supplimentary%20Documentation.docx&wdOrigin=OFFICECOM-WEB.START.SEARCH&ct=1651445242565&action=default&mobileredirect=true

import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(''); 
  const [filename, setFilename] = useState('Choose File'); //upload file 
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState(''); //use state 
  const [uploadPercentage, setUploadPercentage] = useState(0); //state for upload percentage 

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name); // add file name
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); //adding the file upon the upload 

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' //file of a multipart/form-data 
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total) //progress bar for upload 
            )
          );
        }
      });
      
      // Clear percentage 
      setTimeout(() => setUploadPercentage(0), 10000); 

      const { fileName, filePath } = res.data; 

      setUploadedFile({ fileName, filePath }); //upload the file name and the path 

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
