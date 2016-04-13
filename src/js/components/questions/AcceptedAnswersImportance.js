import React, { PropTypes, Component } from 'react';
import TextRadios from './../ui/TextRadios';

export default class AcceptedAnswersImportance extends Component {
    static propTypes = {
        irrelevant         : PropTypes.bool.isRequired,
        answeredAndAccepted: PropTypes.bool,
        onClickHandler     : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOnImportanceClick = this.handleOnImportanceClick.bind(this);

        this.state = {
            importance: null
        };
    }

    render() {
        return (
            <div className="accepted-answers-importance">
                {this.props.irrelevant ?
                    <TextRadios title={'¿Te importa la respuesta del usuario?'} labels={[
						{key: 'irrelevant', text: 'Irrelevante'}
						]} onClickHandler={this.handleOnImportanceClick} value={this.state.importance}/>
                    :
                    <TextRadios title={'¿Te importa la respuesta del usuario?'} labels={[
						{key: 'few', text: 'Poco'},
						{key: 'normal', text: 'Normal'},
						{key: 'aLot', text: 'Mucho'}
					]} onClickHandler={this.handleOnImportanceClick} value={this.state.importance}/>
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
