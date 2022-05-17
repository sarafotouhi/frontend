import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Loadable from 'react-loadable';
import LoadingComponent from './LoadingComponent';

const ShowMore = Loadable({
	loader: () => import("./ShowMore.jsx"),
	loading: LoadingComponent
})


const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
    padding: 0,
    '&:hover': {
      backgroundColor: yellow[700],
    },
}));

export default function PopOver({text, externalText}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [externalTextObj, setexternalTextObj] = React.useState({});
  const [validTargetPhrase, setvalidTargetPhrase] = React.useState(false);
  const handleClick = (event) => {
    Object.entries(externalText).forEach(([key, value]) => {
        if (key !== text) setvalidTargetPhrase(false)
        else {
          setexternalTextObj(externalText)
          setvalidTargetPhrase(true)
        }
    })
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <span>
      <ColorButton aria-describedby={id} variant="contained" onClick={handleClick}>
        {text}
      </ColorButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
     
        {(Object.values(externalTextObj).length !== 0 && validTargetPhrase) ? 
        <Typography style={{width: "auto", borderRadius: "2%", padding: "1%", textAlign:"Center"}}>
            <span style={{fontWeight: "bold"}}>{text}</span>
            <br/>
            <span style={{fontWeight: "bold"}}>Name of Standard:</span>{externalTextObj[text].nameofStandard}
            <br/>
            <span style={{fontWeight: "bold"}}>Page Number: </span>{externalTextObj[text].pageNumber}
            <br/>
            <span style={{fontWeight: "bold"}}>Score: </span>{externalTextObj[text].score}
            <br/>
            <ShowMore text={text} externalText={externalTextObj}/>
        </Typography> : 
        <Typography style={{width: "auto", borderRadius: "2%", padding: "1%", textAlign:"Center"}}>
            <span style={{fontWeight: "bold"}}>No additional info found!</span>
        </Typography>
        }
      </Popover>
    </span>
  );
}