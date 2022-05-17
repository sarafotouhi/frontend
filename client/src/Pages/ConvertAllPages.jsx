import React from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import Loadable from 'react-loadable';
import LoadingComponent from './LoadingComponent'
/*
Description: This class uses url given as input to convert the document at url into text
*/

const DisplayText = Loadable({
	loader: () => import('./DisplayText.jsx'),
	loading: LoadingComponent
})

class ConvertAllPages extends React.Component {

	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			TextArray: [],
			renderAgain: false, //this compoenent state renders everything again ocne TextArray is filled with contend
            //doc properties 
            currPage: 1, //Pages are 1-based not 0-based
            numPages: 0,
            thePDF: null,
		};

        this.pdfTextExtractor = this.pdfTextExtractor.bind(this);
        this.getPages = this.getPages.bind(this);
        this.getItems = this.getItems.bind(this);
		this.updateTextArray = this.updateTextArray.bind(this);
        this.updateState = this.updateState.bind(this);
	}

	//--------------------------------------------------------
	updateState (pdf, numPages){
		this.setState({thePDF: pdf});
		this.setState({numPages: numPages});
	}

	//this function extract a page from the pdf 
  	async pdfTextExtractor (url){
        var PDFObj, numPages; //setting addition variables here because setState is throwing error
		await pdfjsLib.getDocument(url).promise.then(function test(pdf) {
            //Setting PDFJS as local object  then calling updateState to update the state variable 'thePDF' (Taking the content of PDFObj outside of the function).
            PDFObj = pdf;
            numPages = pdf.numPages;
        });
        await this.updateState(PDFObj, numPages)
	}

	//This function fetches the page given page number
    async getPages(PageNumber){
        const page = await this.state.thePDF.getPage(PageNumber) //this line can change to the number of page that is turned into text
        return await page.getTextContent()
    }

	//This function keeps a running string array, and add textPage to an array as one of the index
	updateTextArray(content){
        this.setState(previousState => ({
            TextArray: [...previousState.TextArray, content]
        }));
		if (this.state.TextArray.length === this.state.numPages) this.setState({renderAgain: true})
	};

	//This function extract each line in the extracted page turns into txt string (all in all, the entire page into string Array)
	async getItems(){
        let content;
		const pdfjs = await import('pdfjs-dist/build/pdf');
		const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
	  
		pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
		await this.pdfTextExtractor(this.props.url); //this fetches the document
		//The for-loop calls getPages function for each page number
		for (let i = 1; i <= this.state.numPages; i++){
            content = await this.getPages(i);
			//For each line in a page, add it to the maintained string array
            await this.updateTextArray(content.items);
        }
	}

	// ComponentDidMount is used to execute the code after first render
	componentDidMount() {
		this.getItems();
	}
	
	render() {
		if (!this.state.renderAgain) 
		return <div>Fetching Contract ...</div>   
		return (
			<DisplayText TextArray={this.state.TextArray} /> 
	);
    }
}

export default ConvertAllPages;
