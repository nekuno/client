import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import Input from '../ui/Input';
import FullWidthButton from '../ui/FullWidthButton';
import Framework7Service from '../../services/Framework7Service';

@translate('UnlockGroupPopup')
export default class UnlockGroupPopup extends Component {

    static propTypes = {
        onClickOkHandler: PropTypes.func,
        joining         : PropTypes.bool,
        contentRef      : PropTypes.func,
        // Injected by @translate:
        strings         : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onOkClick = this.onOkClick.bind(this);

        this.state = {
            opened: false
        };
    }

    componentDidMount() {
        Framework7Service.$$()('.popup-unlock-group').on('popup:opened', () => {
            this.setState({opened: true});
        });
        Framework7Service.$$()('.popup-unlock-group').on('popup:closed', () => {
            this.setState({opened: false});
        });
    }

    onOkClick() {
        const token = this.refs.token.getValue();
        this.props.onClickOkHandler(token);
    }

    render() {
        const {joining, contentRef, strings} = this.props;
        const {opened} = this.state;

        return (
            <div className="popup popup-unlock-group tablet-fullscreen">
                <div ref={contentRef} className="content-block">
                    <div className="title">{strings.enterToken}</div>
                    <div className="list-block">
                        <ul>
                            {opened ? <Input ref="token" placeholder={strings.enterTokenText} maxLength={"200"}/> : null}
                        </ul>
                    </div>
                    <FullWidthButton onClick={this.onOkClick} disabled={ joining }>{strings.ok}</FullWidthButton>
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
        ok            : 'Unlock'
    }
};