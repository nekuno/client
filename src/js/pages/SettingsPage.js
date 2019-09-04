import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import { VERSION } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import Framework7Service from '../services/Framework7Service';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';

@AuthenticatedComponent
@translate('SettingsPage')
export default class SettingsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.disableAccount = this.disableAccount.bind(this);
    }

    disableAccount() {
        Framework7Service.nekunoApp().confirm(this.props.strings.disableConfirm, this.props.strings.disableTitle,
            () => {
                UserActionCreators.setOwnEnabled(false).then(
                    () => {
                        LoginActionCreators.logoutUser();
                    }
                ).catch(
                    (error) => {
                        Framework7Service.nekunoApp().alert(this.props.strings.disableError);
                        console.log(error);
                    }
                );
            },
            () => {
            }
        )
    }

    render() {

        const {strings} = this.props;

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.title}/>
                <div className="view view-main">
                    <div className="page settings-page">
                        <div id="page-content" className="settings-content">
                            <p>{strings.version}: {VERSION}</p>
                            <p><a href="https://nekuno.com/terms/" target="_blank">{strings.legalTerms}</a></p>
                            <p><a href="https://nekuno.com/privacy/" target="_blank">{strings.privacyPolicy}</a></p>
                            <p><a href="javascript:void(0)" onClick={this.disableAccount}><span className="icon-warning"></span>&nbsp;&nbsp;{strings.disable}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SettingsPage.defaultProps = {
    strings: {
        title         : 'Settings',
        version       : 'Nekuno version',
        legalTerms    : 'End-user license agreement',
        privacyPolicy : 'Privacy Policy',
        disable       : 'Disable account',
        disableConfirm: 'Do you want to disable your account? It will be deleted after 3 months if you don`t enable it again.',
        disableTitle  : 'Disable account',
        disableError  : 'We couldn´t disable your account'
    }
};