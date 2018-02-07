import {GOOGLE_RECAPTCHA_API_KEY} from '../../constants/Constants';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import Input from '../ui/Input';
import connectToStores from '../../utils/connectToStores';
import translate from '../../i18n/Translate';
import ConnectActionCreators from '../../actions/ConnectActionCreators';
import LoginActionCreators from '../../actions/LoginActionCreators';
import InvitationStore from '../../stores/InvitationStore';


function getState(props) {
    const invitation = InvitationStore.invitation;

    return {
        invitation
    };
}


@translate('GroupField')
@connectToStores([InvitationStore], getState)
export default class GroupField extends Component {
    static propTypes = {
        onChangeField    : PropTypes.func,
        onValidInvitation: PropTypes.func,
        activeSlide      : PropTypes.bool,
        // Injected by @connectToStores:
        invitation: PropTypes.object,
        // Injected by @translate:
        strings          : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onVerifyCallback = this.onVerifyCallback.bind(this);

        this.state = {
            attempts: 0,
            mustVerify: null
        }
    }

    componentDidMount() {
        const {activeSlide} = this.props;

        if (activeSlide) {
            // Uncomment to auto-focus
            //this.focus();
        }
    }

    componentDidUpdate() {
        const {activeSlide, invitation} = this.props;
        const {attempts} = this.state;

        if (activeSlide) {
            // Uncomment to auto-focus
            //this.focus();
        }
        if (invitation) {
            const profile = {mode: 'assist'};
            LoginActionCreators.preRegisterProfile(profile);
            this.props.onValidInvitation();
        } else if(attempts >= 10) {
            this.setState({mustVerify: true, attempts: 0});
        }

    }

    handleOnChange() {
        const {attempts} = this.state;
        let token = this.refs.input.getValue() || '';
        token = this.parseToken(token);
        if(!token || token.length < 4) {
            return;
        }

        this.setState({attempts: attempts + 1});

        if (!this.tokenTimeout) {
            this.tokenTimeout = setTimeout(() => {
                ConnectActionCreators.validateInvitation(token);
            }, 0);

            if (this.props.onChangeField) {
                this.props.onChangeField();
            }

            return;
        }

        clearTimeout(this.tokenTimeout);

        this.tokenTimeout = setTimeout(() => {
            ConnectActionCreators.validateInvitation(token);
        }, 2000);

        if (this.props.onChangeField) {
            this.props.onChangeField();
        }
    }

    parseToken = function(token) {
        token = token.replace(/(http[s]?:\/\/)?(m\.)?(client\.)?(pre\.)?(local\.)?nekuno.com\/register\/\?token=/ig, '');

        return token.replace(/(http[s]?:\/\/)?(www\.)?(pre\.)?(local\.)?(nekuno.com\/)?(invitation\/)?(inv)?/ig, '');
    };

    focus() {
        setTimeout(() => {
            let inputElem = document.querySelector('.item-input input');
            if (inputElem) {
                inputElem.focus();
            }
        }, 0);
    }

    onLoadCallback() {
    }

    onVerifyCallback() {
        this.setState({mustVerify: false});
    }

    render() {
        const {strings} = this.props;
        const {mustVerify} = this.state;

        return (
            <div className="register-fields">
                <div className="register-field group-field">
                    {!mustVerify ?
                        <div className="list-block">
                            <ul>
                                <Input ref={'input'} onChange={this.handleOnChange} placeholder={strings.placeholder} doNotFocus={true} doNotScroll={true}/>
                            </ul>
                        </div>
                        :
                        <Recaptcha
                            sitekey={GOOGLE_RECAPTCHA_API_KEY}
                            verifyCallback={this.onVerifyCallback}
                            onloadCallback={this.onLoadCallback}
                        />

                    }
                </div>
            </div>
        );
    }
}

GroupField.defaultProps = {
    strings: {
        placeholder: 'Badge code',
        save       : 'Continue',
        selectOther: 'Select other objectives if you want'
    }
};
