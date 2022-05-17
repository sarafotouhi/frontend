import React from "react";

/*
Description: This class will call the API that fetches target phrases from AWS server
*/
class FetchTargetPhrase extends React.Component {
    // Constructor
	constructor(props) {
		super(props);

		this.state = {
			targetPhraseData: null,
            renderAgain: false
		};

        this.getTargetPhrase = this.getTargetPhrase.bind(this);
        this.updateTargetPhraseData = this.updateTargetPhraseData.bind(this);
	}

    updateTargetPhraseData (data){
		this.setState({targetPhraseData: data});
	}
    async getTargetPhrase(requestOptions) {
        let response = await fetch(process.env.REACT_APP_AWS_API + '/requirements', requestOptions)
        let data = await response.json()
        this.updateTargetPhraseData(data);
        return data;
    }

    componentDidMount() {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            body: JSON.stringify({ title: 'Target Phrase' })
        };
		this.getTargetPhrase(requestOptions);
        this.setState({renderAgain: true});
	}
	
	render() {
		if (!this.state.renderAgain) 
			return <div>
				<h1> Loading 1.... </h1> 
			</div> 
		return (
			<div>
                <h1> Fetched </h1> 
            </div>
	);
    }
}

export default FetchTargetPhrase;
