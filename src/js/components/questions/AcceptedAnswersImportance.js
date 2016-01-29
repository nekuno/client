import React, { PropTypes, Component } from 'react';
import TextCheckboxes from './../ui/TextCheckboxes';

export default class AcceptedAnswersImportance extends Component {
	static propTypes = {
		irrelevant: PropTypes.bool.isRequired,
		answeredAndAccepted: PropTypes.bool,
		onClickHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.handleOnImportanceClick = this.handleOnImportanceClick.bind(this);

		this.state = {
			importance: false
		};
	}

	render() {
		return (
			<div className="accepted-answers-importance">
				<div className="accepted-answers-importance-title">¿Te importa la respuesta del usuario?</div>
				{this.props.irrelevant ?

					<TextCheckboxes labels={[{key: 'irrelevant', text: 'Irrelevante'}]} onClickHandler={this.handleOnImportanceClick} enabled={this.state.importance} />
					:
					<TextCheckboxes labels={[
						{key: 'few', text: 'Poco'},
						{key: 'normal', text: 'Normal'},
						{key: 'aLot', text: 'Mucho'}
					]} onClickHandler={this.handleOnImportanceClick} enabled={this.state.importance} />
				}
			</div>
		);
	}

	handleOnImportanceClick(key) {
		if (!this.props.answeredAndAccepted) {
			this.showNotCompleteModal();
			return;
		}

		this.setState({
			importance: key
		});
		this.props.onClickHandler(key);
	}

	showNotCompleteModal = function() {
		nekunoApp.alert('Marca tu respuesta y una o varias opciones en la segunda columna para indicar qué te gustaría que respondiera otro usuario');
	};
}
