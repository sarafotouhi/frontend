import React from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf"
class PdfToText extends React.Component {
	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			TextArray: [],
			renderAgain: false, //this compoenent state renders everything again ocne TextArray is filled with contend
		};
		this.updateTextArray = this.updateTextArray.bind(this);
	}

//--------------------------------------------------------
//this function extract a page from the pdf 
  	async pdfTextExtractor (url){
		pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js'
		const doc = await pdfjsLib.getDocument(url).promise
		const page = await doc.getPage(1) //this line can change which page gets turned into text
		return await page.getTextContent()
	}

//this function extract each line in the extracted page turns into txt string (line by line, each page of the document is converted into string array)
	async getItems(){
		const content = await this.pdfTextExtractor(this.props.url)
		this.updateTextArray(content.items);
		const items = content.items.map((item) => {
			return item
		})
		return items
	}

	updateTextArray(content){
		this.setState({TextArray: content});
		this.setState({renderAgain: true})		
	}

	// ComponentDidMount is used to
	// execute the code
	componentDidMount() {
			this.getItems()	
	}
	
	render() {
		
		return (
			<div>
				{this.state.renderAgain? this.state.TextArray.map(item => <div key={item}>{item.str}</div>)
				: console.log('empty')}
			</div>
      
	);
}
}

export default PdfToText;
