import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import translate from '../../i18n/Translate';
import FullWidthButton from '../ui/FullWidthButton';

@translate('RegisterQuestionsFinishedPopup')
export default class RegisterQuestionsFinishedPopup extends Component {
    static propTypes = {
        onContinue: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        contentRef: PropTypes.func,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onTests = this.onTests.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    onTests() {
        this.props.onClose();
    };


    onContinue() {
        this.props.onContinue();
    }

    render() {
        const popupClass = 'popup popup-register-finished tablet-fullscreen';
        const {contentRef, strings} = this.props;
        return (

            <div className={popupClass}>
                <div ref={contentRef} className="content-block">
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
}

RegisterQuestionsFinishedPopup.defaultProps = {
    strings: {
        title    : 'Congratulations!',
        text     : 'You´ve completed mandatory 4 questions; if you want to improve your recommendations even more, you can answer more questions from your profile',
        moreTests: 'Do more tests',
        continue : 'Continue to recommendations'
    }
};
