import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class AcceptedAnswersImportance extends Component {
	static propTypes = {
		irrelevant: PropTypes.bool.isRequired
	};

	constructor(props) {
		super(props);

		this.handleOnFewImportanceClick = this.handleOnFewImportanceClick.bind(this);
		this.handleOnNormalImportanceClick = this.handleOnNormalImportanceClick.bind(this);
		this.handleOnALotImportanceClick = this.handleOnALotImportanceClick.bind(this);
		this.handleOnIrrelevantImportanceClick = this.handleOnIrrelevantImportanceClick.bind(this);

		this.state = {
			importance: false
		};
	}

	render() {
		return (
			<div className="accepted-answers-importance">
				<div className="accepted-answers-importance-title">¿Te importa la respuesta del usuario?</div>
				{this.props.irrelevant ?
					<div className="accepted-answers-importance-container unique-chip">
						<Chip label={"Irrelevante"} onClickEvent={this.handleOnIrrelevantImportanceClick} disabled={this.state.importance !== 'irrelevant'} />
					</div>
					:
					<div className="accepted-answers-importance-container">
						<Chip label={"Poco"} onClickEvent={this.handleOnFewImportanceClick} disabled={this.state.importance !== 'few'} />
						<Chip label={"Normal"} onClickEvent={this.handleOnNormalImportanceClick} disabled={this.state.importance !== 'normal'} />
						<Chip label={"Mucho"} onClickEvent={this.handleOnALotImportanceClick} disabled={this.state.importance !== 'aLot'} />
					</div>
				}
			</div>

		);
	}

	handleOnFewImportanceClick() {
		this.setState({
			importance: 'few'
		});
	}

	handleOnNormalImportanceClick() {
		this.setState({
			importance: 'normal'
		});
	}

	handleOnALotImportanceClick() {
		this.setState({
			importance: 'aLot'
		});
	}

	handleOnIrrelevantImportanceClick() {
		this.setState({
			importance: 'irrelevant'
		});
	}
}
