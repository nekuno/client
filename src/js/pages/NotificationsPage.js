import React, { PropTypes, Component } from 'react';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class NotificationsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Notificaciones'}/>
                <div data-page="index" className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                    </div>
                </div>
            </div>
        );
    }
});