import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 3,
  pb: 3,
  borderRadius: "2%",
  overflow: "scroll",
  width: "50%",
  height: "75%",
};

export default function ShowMore({text, externalText}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Show More</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        
      >
        <Box sx={{ ...style}}>
          <h2 id="child-modal-title">{text}</h2>
          <p id="child-modal-description">
            <span style={{fontWeight: "bold"}}>Name of Standard: </span>{externalText[text].nameofStandard}
            <br/>
            <span style={{fontWeight: "bold"}}>Target Position: </span> {(externalText[text].targetPosition === "") ? "Does not have target position" : externalText[text].targetPosition}
            <br/>
            <span style={{fontWeight: "bold"}}>Page Number: </span>{externalText[text].pageNumber}
            <br/>
            <span style={{fontWeight: "bold"}}>Score: </span>{externalText[text].score}
            <br/>
            <span style={{fontWeight: "bold"}}>Regulatory Requirement: </span>{externalText[text].req}
            <br/>
            <span style={{fontWeight: "bold"}}>Contend of the page: </span>{externalText[text].pageContent}
            <br/>
            <span style={{fontWeight: "bold"}}>Content: </span>{externalText[text].content.map(line => <span dangerouslySetInnerHTML={{ __html: " " + line + " "}} />)}
            
          </p>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}