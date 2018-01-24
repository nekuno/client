import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    }

    componentDidMount() {
        const {activeSlide} = this.props;

        if (activeSlide) {
            this.focus();
        }
    }

    componentDidUpdate() {
        const {activeSlide, invitation} = this.props;

        if (activeSlide) {
            this.focus();
        }
        if (invitation) {
            const profile = {mode: 'events'};
            LoginActionCreators.preRegisterProfile(profile);
            this.props.onValidInvitation();
        }

    }

    handleOnChange() {
        clearTimeout(this.tokenTimeout);
        let token = this.refs.input.getValue();
        if (token.length >= 4) {
            this.tokenTimeout = setTimeout(() => {
                token = token.replace(/(http[s]?:\/\/)?(m\.)?(client\.)?(pre\.)?(local\.)?nekuno.com\/register\/\?token=/ig, '');
                token = token.replace(/(http[s]?:\/\/)?(www\.)?(pre\.)?(local\.)?(nekuno.com\/)?(invitation\/)?(inv)?/ig, '');
                if (token) {
                    ConnectActionCreators.validateInvitation(token);
                }
            }, 500);
        }
        if (this.props.onChangeField) {
            this.props.onChangeField();
        }
    }

    focus() {
        setTimeout(() => {
            let inputElem = document.querySelector('.item-input input');
            if (inputElem) {
                inputElem.focus();
            }
        }, 0);
    }
    
    render() {
        const {strings} = this.props;

        return (
            <div className="register-fields">
                <div className="register-field group-field">
                    <div className="list-block">
                        <ul>
                            <Input ref={'input'} onChange={this.handleOnChange} placeholder={strings.placeholder} doNotFocus={true} doNotScroll={true}/>
                        </ul>
                    </div>
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
