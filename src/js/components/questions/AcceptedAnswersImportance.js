import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextRadios from './../ui/TextRadios';
import translate from '../../i18n/Translate';
import Framework7Service from '../../services/Framework7Service';
import SelectInline from "../ui/SelectInline/SelectInline";

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
        this.handleSelectInlineOnImportanceClick = this.handleSelectInlineOnImportanceClick.bind(this);

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

    handleSelectInlineOnImportanceClick(key) {
        if (!this.props.answeredAndAccepted) {
            this.showNotCompleteModal();
            return;
        }

        this.setState({
            importance: key[0]
        });
        this.props.onClickHandler(key[0]);
    }

    showNotCompleteModal() {
        const {strings} = this.props;
        Framework7Service.nekunoApp().alert(strings.alert);
    };

    render() {
        const {answeredAndAccepted, strings} = this.props;
        const className = answeredAndAccepted ? 'accepted-answers-importance' : 'accepted-answers-importance disabled';

        const options = [
            {
                id: "few",
                text: strings.few
            },
            {
                id: "normal",
                text: strings.normal
            },
            {
                id: "aLot",
                text: strings.aLot
            }
        ];

        return (
            <div className={className}>
                {this.props.irrelevant ?
                    <TextRadios labels={[
                        {key: 'irrelevant', text: strings.irrelevant}
                    ]} onClickHandler={this.handleOnImportanceClick} value={this.state.importance}/>
                    :
                    <SelectInline
                        options={options}
                        onClickHandler={this.handleSelectInlineOnImportanceClick}
                        defaultOption={this.state.importance}
                    />

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