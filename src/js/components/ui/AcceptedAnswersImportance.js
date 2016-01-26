import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class AcceptedAnswersImportance extends Component {
	static propTypes = {
		irrelevant: PropTypes.bool.isRequired,
		answeredAndAccepted: PropTypes.bool,
		onClickHandler: PropTypes.func.isRequired
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
						<Chip label={"Irrelevante"} onClickHandler={this.handleOnIrrelevantImportanceClick} disabled={this.state.importance !== 'irrelevant'} />
					</div>
					:
					<div className="accepted-answers-importance-container">
						<Chip label={"Poco"} onClickHandler={this.handleOnFewImportanceClick} disabled={this.state.importance !== 'few'} />
						<Chip label={"Normal"} onClickHandler={this.handleOnNormalImportanceClick} disabled={this.state.importance !== 'normal'} />
						<Chip label={"Mucho"} onClickHandler={this.handleOnALotImportanceClick} disabled={this.state.importance !== 'aLot'} />
					</div>
				}
			</div>

		);
	}

	handleOnFewImportanceClick() {
		if (!this.props.answeredAndAccepted) {
			this.showNotCompleteModal();
			return;
		}
		this.setState({
			importance: 'few'
		});
		this.props.onClickHandler('few');
	}

	handleOnNormalImportanceClick() {
		if (!this.props.answeredAndAccepted) {
			this.showNotCompleteModal();
			return;
		}
		this.setState({
			importance: 'normal'
		});
		this.props.onClickHandler('normal');
	}

	handleOnALotImportanceClick() {
		if (!this.props.answeredAndAccepted) {
			this.showNotCompleteModal();
			return;
		}
		this.setState({
			importance: 'aLot'
		});
		this.props.onClickHandler('aLot');
	}

	handleOnIrrelevantImportanceClick() {
		if (!this.props.answeredAndAccepted) {
			this.showNotCompleteModal();
			return;
		}
		this.setState({
			importance: 'irrelevant'
		});
		this.props.onClickHandler('irrelevant');
	}

	showNotCompleteModal = function() {
		nekunoApp.alert('Marca tu respuesta y una o varias opciones en la segunda columna para indicar qué te gustaría que respondiera otro usuario');
	};
}
