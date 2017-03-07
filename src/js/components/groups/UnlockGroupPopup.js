import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import TextInput from '../ui/TextInput';
import FullWidthButton from '../ui/FullWidthButton';

@translate('UnlockGroupPopup')
export default class UnlockGroupPopup extends Component {

    static propTypes = {
        onClickOkHandler: PropTypes.func,
        joining         : PropTypes.bool,
        // Injected by @translate:
        strings             : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onOkClick = this.onOkClick.bind(this);
    }

    onOkClick() {
        const token = this.refs.token.getValue();
        this.props.onClickOkHandler(token);
    }

    render() {
        const {joining, strings} = this.props;

        return (
            <div className="popup popup-unlock-group tablet-fullscreen">
                <div className="content-block">
                    <p><a className="close-popup">{strings.close}</a></p>
                    <div className="title">{strings.enterToken}</div>
                    <div className="list-block">
                        <ul>
                            <TextInput ref="token" placeholder={strings.enterTokenText} maxLength={"200"} />
                        </ul>
                    </div>
                    <FullWidthButton onClick={this.onOkClick} disabled={joining ? "disabled" : ""}>{strings.ok}</FullWidthButton>
                </div>
            </div>
        );
    }
}

UnlockGroupPopup.defaultProps = {
    strings: {
        enterToken    : 'Badge Code',
        enterTokenText: 'Enter the badge code',
        close         : 'Close',
        ok            : 'Ok'
    }
};