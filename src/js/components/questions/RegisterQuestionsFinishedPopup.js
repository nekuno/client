import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import * as UserActionCreators from '../../actions/UserActionCreators';
import shouldPureComponentUpdate from 'react-pure-render/function';
import translate from '../../i18n/Translate';
import FullWidthButton from '../ui/FullWidthButton';

@translate('RegisterQuestionsFinishedPopup')
export default class RegisterQuestionsFinishedPopup extends Component {
    static propTypes = {
        onContinue: PropTypes.func.isRequired,
        onTests: PropTypes.func.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onTests = this.onTests.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const popupClass = 'popup popup-register-finished tablet-fullscreen';
        const strings = this.props.strings;
        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-register-finished-title title"> {strings.title}</div>
                    <div className="popup-register-finished-text"> {strings.text} </div>
                    <FullWidthButton onClick={this.onTests}> {strings.moreTests}</FullWidthButton>
                    <br />
                    <br />
                    <FullWidthButton onClick={this.onContinue}> {strings.continue}</FullWidthButton>
                </div>
            </div>
        );
    }

    onTests() {
        nekunoApp.closeModal('.popup-register-finished');
        this.props.onTests();
    };


    onContinue() {
        nekunoApp.closeModal('.popup-register-finished');
        this.props.onContinue();
    }
}

RegisterQuestionsFinishedPopup.defaultProps = {
    strings: {
        title    : 'Congratulations!',
        text     : 'You´ve completed mandatory 4 questions; if you want to improve your recommendations even more, you can answer more questions from your profile',
        moreTests: 'Do more tests',
        continue : 'Continue to recommendations'
    }
};
