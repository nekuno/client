import React, { PropTypes, Component } from 'react';
import TextRadios from './../ui/TextRadios';
import translate from '../../i18n/Translate';

@translate('AcceptedAnswersImportance')
export default class AcceptedAnswersImportance extends Component {
    static propTypes = {
        irrelevant         : PropTypes.bool.isRequired,
        answeredAndAccepted: PropTypes.bool,
        onClickHandler     : PropTypes.func.isRequired,
        // Injected by @translate:
        strings            : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleOnImportanceClick = this.handleOnImportanceClick.bind(this);
        this.showNotCompleteModal = this.showNotCompleteModal.bind(this);

        this.state = {
            importance: null
        };
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

    showNotCompleteModal() {
        const {strings} = this.props;
        nekunoApp.alert(strings.alert);
    };

    render() {
        const {strings} = this.props;
        return (
            <div className="accepted-answers-importance">
                {this.props.irrelevant ?
                    <TextRadios title={strings.title} labels={[
						{key: 'irrelevant', text: strings.irrelevant}
						]} onClickHandler={this.handleOnImportanceClick} value={this.state.importance}/>
                    :
                    <TextRadios title={strings.title} labels={[
						{key: 'few', text: strings.few},
						{key: 'normal', text: strings.normal},
						{key: 'aLot', text: strings.aLot}
					]} onClickHandler={this.handleOnImportanceClick} value={this.state.importance}/>
                }
            </div>
        );
    }

}

AcceptedAnswersImportance.defaultProps = {
    strings: {
        title     : 'Do you mind the user response?',
        irrelevant: 'Irrelevant',
        few       : 'Little bit',
        normal    : 'Normal',
        aLot      : 'A lot',
        alert     : 'Mark your answer and one or more options in the second column to indicate what would you like to answer another user'
    }
};