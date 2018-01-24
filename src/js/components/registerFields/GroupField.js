import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FullWidthButton from '../ui/FullWidthButton';
import Button from '../ui/Button';
import Input from '../ui/Input';
import connectToStores from '../../utils/connectToStores';
import translate from '../../i18n/Translate';
import Framework7Service from '../../services/Framework7Service';
import ConnectActionCreators from '../../actions/ConnectActionCreators';
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
        this.handleClickSave = this.handleClickSave.bind(this);
        this.renderFieldDetail = this.renderFieldDetail.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);

        this.state = {
            groupSelected: null,
            savedDetails: null,
            focused: null
        }
    }

    componentDidUpdate() {
        const {activeSlide, invitation} = this.props;
        const {groupSelected, savedDetails} = this.state;

        if (activeSlide) {
            setTimeout(() => {
                let inputElem = document.querySelector('.item-input input');
                if (inputElem) {
                    inputElem.focus();
                }
            }, 0);
        }
        if (invitation && !groupSelected && !savedDetails) {
            this.setState({groupSelected: true});
            this.props.onValidInvitation();
        }

    }

    handleClickSave() {
        this.setState({groupSelected: null, savedDetails: true});
    }

    handleOnChange() {
        clearTimeout(this.tokenTimeout);
        let token = this.refs.input.getValue();
        if (token.length >= 4) {
            this.tokenTimeout = setTimeout(() => {
                token = token.replace(/(http[s]?:\/\/)?(m\.)?(client\.)?(pre\.)?(local\.)?nekuno.com\/#\/register\/\?token=/ig, '');
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

    renderFieldDetail() {
        const {strings} = this.props;
        return <div className="register-field-detail objectives-field-detail">
            <div>
                The badge stuff...
                <div className="button-wrapper">
                    <FullWidthButton type="submit" onClick={this.handleClickSave}>{strings.save}</FullWidthButton>
                </div>
            </div>
        </div>
    };
    
    render() {
        const {strings} = this.props;
        const {groupSelected, savedDetails} = this.state;
        const groupClass = "register-field group-field";

        return (
            <div className="register-fields">
                <div className={groupSelected ? "hide " + groupClass : savedDetails ? "show " + groupClass : groupClass}>
                    {savedDetails ?
                        <div className="register-fields-continue">
                            <Button>{strings.save}</Button>
                            <div className="title">{strings.selectOther}</div>
                        </div>
                        : null
                    }
                    {!groupSelected && !savedDetails ?
                        <div className="list-block">
                            <ul>
                                <Input ref={'input'} onChange={this.handleOnChange} placeholder={strings.placeholder} doNotFocus={true} doNotScroll={true}/>
                            </ul>
                        </div>
                        : null}
                </div>
                {groupSelected ? this.renderFieldDetail() : null}
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
