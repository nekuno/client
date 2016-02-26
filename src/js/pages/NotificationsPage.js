import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import LastMessage from '../components/ui/LastMessage';

export default AuthenticatedComponent(class NotificationsPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mensajes'}/>
                <div data-page="index" className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        <LastMessage username={'Usuario1'} text={'Texto mesaje usuario 1 ...'} datetime={'20160220'} canSendMessage={true} picture={''} userId={2} loggedUserId={3} online={false} />
                        <hr />
                        <LastMessage username={'Usuario2'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.'} datetime={'20160120'} canSendMessage={true} picture={''} userId={4} loggedUserId={3} online={true} />
                        <hr />
                        <LastMessage username={'Usuario1'} text={'Texto mesaje usuario 1 ...'} datetime={'20160220'} canSendMessage={true} picture={''} userId={2} loggedUserId={3} online={false} />
                        <hr />
                        <LastMessage username={'Usuario2'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.'} datetime={'20160120'} canSendMessage={true} picture={''} userId={4} loggedUserId={3} online={true} />
                        <hr />
                        <LastMessage username={'Usuario1'} text={'Texto mesaje usuario 1 ...'} datetime={'20160220'} canSendMessage={true} picture={''} userId={2} loggedUserId={3} online={false} />
                        <hr />
                        <LastMessage username={'Usuario2'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.'} datetime={'20160120'} canSendMessage={true} picture={''} userId={4} loggedUserId={3} online={true} />
                        <hr />
                    </div>
                </div>
            </div>
        );
    }
});