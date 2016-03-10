import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DailyMessages from '../components/ui/DailyMessages';
import MessagesToolBar from '../components/ui/MessagesToolBar';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import ChatMessageStore from '../stores/ChatMessageStore';
import connectToStores from '../utils/connectToStores';

function requestData(props) {
    const userId = props.params.userId;
    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
}

function getState(props) {

    const { params } = props;
    const userId = params.userId;
    const messages = ChatMessageStore.getAllForUser(userId);
    const otherUser = UserStore.get(userId);

    return {
        messages,
        otherUsername: otherUser ? otherUser.username : ''
    };
}

@connectToStores([ChatMessageStore, UserStore], getState)
export default AuthenticatedComponent(class MessagesPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string
        }),

        // Injected by @connectToStores:
        messages : PropTypes.array.isRequired,
        otherUser: PropTypes.object,

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    componentDidMount() {
        this._scrollToBottom();
    }

    componentDidUpdate() {
        this._scrollToBottom();
    }

    _scrollToBottom() {
        var list = this.refs.list;
        list.scrollTop = list.scrollHeight;
    }

    render() {
        let messages = this.props.messages;
        let otherUsername = this.props.otherUsername;
        return (
            <div className="view view-main" ref="list">
                <LeftMenuTopNavbar centerText={otherUsername}/>
                <div data-page="index" className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        <DailyMessages messages={messages} date={'20160223'}/>
                        <br />
                    </div>
                </div>
                <div>
                    <MessagesToolBar onClickHandler={function() {}}/>
                </div>
            </div>
        );
    }
});