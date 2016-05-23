import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import * as UserActionCreators from '../../actions/UserActionCreators';
import shouldPureComponentUpdate from 'react-pure-render/function';
import translate from '../../i18n/Translate';
import FullWidthButton from '../ui/FullWidthButton';

@translate('EmptyThreadPopup')
export default class EmptyThreadPopup extends Component {
    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object,
        threadId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const popupClass = 'popup popup-empty-thread tablet-fullscreen';
        const {strings, threadId} = this.props;
        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-register-finished-title title"> {strings.title}</div>
                    <div className="popup-register-finished-text"> {strings.text} </div>
                    <Link to={`/edit-thread/${threadId}`}>
                        <FullWidthButton> {strings.editThread}</FullWidthButton>
                    </Link>

                    <br />
                    <br />
                    <Link to='/threads'>
                        <FullWidthButton> {strings.goBack}</FullWidthButton>
                    </Link>
                </div>
            </div>
        );
    }
}

EmptyThreadPopup.defaultProps = {
    strings: {
        title: 'Oops!',
        text: 'This yarn is empty! Edit its filters to get recommendations or go back to the yarns list and try another.',
        editThread: 'Edit this yarn',
        goBack: 'Go back'
    }
};
