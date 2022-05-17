import React from "react";
import Loadable from 'react-loadable';
import Highlighter from "react-highlight-words";
import LoadingComponent from './LoadingComponent'
// import PopOver from "./PopOver";
/*
Description: This class will call the API that fetches target phrases from AWS server && iterate through the contract text array and displays its content
*/
const PopOver = Loadable({
	loader: () => import("./PopOver"),
	loading: LoadingComponent
})

class DisplayText extends React.Component {
    // Constructor
	constructor(props) {
		super(props);

		this.state = {
			targetPhraseData: [],
            renderAgain: false,
            TextDoc: "",
            ExternalTextObj: {},
            TargetPhrasesArray: []
		};

        this.getTargetPhrase = this.getTargetPhrase.bind(this);
        this.updateTargetPhraseData = this.updateTargetPhraseData.bind(this);
        this.generateTextString = this.generateTextString.bind(this);
        this.generateTargetPhraseArray = this.generateTargetPhraseArray.bind(this)
	}

    updateTargetPhraseData (data){
		this.setState({targetPhraseData: data});
	}

    //This function fetches targetPhrases in the documents from the backend of the system
    async getTargetPhrase(requestOptions) {
        let response = await fetch(process.env.REACT_APP_AWS_API + "/requirements", requestOptions)
        let data = await response.json()
        this.updateTargetPhraseData(data);
        return data;
    }

    //This function formats formatted text in a neat manner
    generateTextString(){
        let tempPage = "";
       //In this function we can manupulate contract doc text to check for newline and add \n when line ends
        this.props.TextArray.map((Page, pageIndex) => {
            var lastY = Page[0].transform[5];
            tempPage += '\n___________________________________________________________________________________________\n'
            tempPage += '\n'
            tempPage += Page.map((line, lineIndex)=> {
                let lineReturned
                if (lastY !== line.transform[5]) {
                    lastY = line.transform[5];
                    lineReturned = '\n' + line.str 
                    return lineReturned
                }
                else {
                    lineReturned = line.str
                    return lineReturned
                }
                }).join(' ')
                tempPage += '\n'
                return tempPage;
            })
            this.setState({TextDoc: tempPage});
        }

   
    generateTargetPhraseArray(){

    this.state.targetPhraseData.targetPhraseData.map((targetPhraseObj, arrayIndex) => {
        if (arrayIndex % 3 === 0)  {
            this.setState(previousState => ({
            TargetPhrasesArray: [...previousState.TargetPhrasesArray, targetPhraseObj]
        }));   
    }
        return this.state.TargetPhrasesArray

    })
   }

    updateExternalTextObj(ExtTextObj){
		this.setState({ExternalTextObj: ExtTextObj});
	}   

    //this function fetches document from the S3 into the system so that it can be converted into text
    async getExternalText(requestExternalText) {
        let response = await fetch(process.env.REACT_APP_AWS_API + "/requirements", requestExternalText)
        let data = await response.json()
        this.updateExternalTextObj(data);
        return data;
    }

    async componentDidMount() {
        //This POST call request to get target phrases for the document uploaded on S3 by the user 
        const requestTargetPhrases = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            body: JSON.stringify({ title: 'Target Phrase' })
        };

        await this.getTargetPhrase(requestTargetPhrases);
        await this.generateTargetPhraseArray();
        this.generateTextString();
     
    //This GET call request to download document that was just uploaded by the user onto the system such that it can be converted into text and displayed to the user 
        const requestExternalText = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
        };
		this.getExternalText(requestExternalText);
        this.setState({renderAgain: true});
		
	}
    
	
	render() {
        let Highlight;
        //While system is fetching document and extracting target position and phrases, this component will be displayed
		if (!this.state.renderAgain) 
			return <div>Fetching Contract ...</div> 

        //Once system finished converting document from s3 into text, it will be passed to this component in ExternalTextObj variable to be displayed to the user
        //children variable holds target phrases and psositions to be highlighted within the given text. Read more about it from library npm page: https://www.npmjs.com/package/react-highlight-words
        
        if (Object.keys(this.state.ExternalTextObj).length !== 0){
            Highlight = ({ children, highlightIndex }) => (
                <PopOver
                    className="highlighted-text" 
                    style={{backgroundColor: "Yellow"}} 
                    text={children} 
                    externalText={this.state.ExternalTextObj}
                />
            );
        }
        
		return (
			<div>
                {(this.state.TextDoc && this.state.targetPhraseData && this.state.TargetPhrasesArray) ? 
                    <div style={{textAlign: "left", marginLeft: "5%", whiteSpace:"pre-line"}}>  
                    <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={this.state.targetPhraseData.targetPhraseData}
                        autoEscape={true}
                        textToHighlight={this.state.TextDoc}
                        highlightTag={Highlight}
                    /> 
                    </div>
                    : console.log(this.state.TextDoc)
                }   
            </div>
	    );
    }
}

export default DisplayText;