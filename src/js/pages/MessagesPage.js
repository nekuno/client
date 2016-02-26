import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DailyMessages from '../components/ui/DailyMessages';
import MessagesToolBar from '../components/ui/MessagesToolBar';

export default AuthenticatedComponent(class MessagesPage extends Component {


    render() {
        let messages = [
            {
                text: 'Texto mesaje usuario 1 ...',
                datetime: '20160220',
                isOwnMessage: true
            },
            {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.',
                datetime: '20160120',
                isOwnMessage: true
            },
            {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.',
                datetime: '20151220',
                isOwnMessage: false
            },
            {
                text: 'Texto mesaje usuario 4 ...',
                datetime: '20141020',
                isOwnMessage: false
            },
            {
                text: 'Texto mesaje usuario 1 ...',
                datetime: '20160220',
                isOwnMessage: true
            },
            {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.',
                datetime: '20160120',
                isOwnMessage: true
            },
            {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc enim, bibendum in arcu id, aliquet euismod tellus. Sed feugiat nisi a accumsan cursus. Nullam ac massa vitae massa mollis ullamcorper.',
                datetime: '20151220',
                isOwnMessage: false
            },
            {
                text: 'Texto mesaje usuario 4 ...',
                datetime: '20141020',
                isOwnMessage: false
            }
        ];
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'username'}/>
                <div data-page="index" className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        <DailyMessages messages={messages} ownPicture={''} otherPicture={''} date={'20160223'} />
                        <DailyMessages messages={messages} ownPicture={''} otherPicture={''} date={'20160225'} />
                        <br />
                    </div>
                </div>
                <MessagesToolBar onClickHandler={function() {}} />
            </div>
        );
    }
});