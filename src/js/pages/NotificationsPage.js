import React, { PropTypes, Component } from 'react';
import TopLeftMenuLink from '../components/ui/TopLeftMenuLink';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

export default AuthenticatedComponent(class NotificationsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <TopLeftMenuLink centerText={'Notificaciones'}/>
                <div data-page="index" className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                    </div>
                </div>
            </div>
        );
    }
});