import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DailyMessages from '../components/ui/DailyMessages';
import MessagesToolBar from '../components/ui/MessagesToolBar';
import * as UserActionCreators from '../actions/UserActionCreators';
import ChatActionCreators from '../actions/ChatActionCreators';
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
        otherUser
    };
}

@connectToStores([ChatMessageStore, UserStore], getState)
export default AuthenticatedComponent(class ChatMessagesPage extends Component {

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

    constructor(props) {
        super(props);

        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

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
        if (ChatMessageStore.isFresh(this.props.params.userId)) {
            var list = this.refs.list;
            list.scrollTop = list.scrollHeight;
        }
    }

    sendMessageHandler(messageText) {
        const { params } = this.props;
        const userId = params.userId;
        ChatActionCreators.sendMessage(userId, messageText);
    }

    handleScroll() {
        var list = this.refs.list;
        if (list.scrollTop === 0) {
            if (ChatMessageStore.noMoreMessages(this.props.params.userId)) {
                list.removeEventListener('scroll', this.handleScroll);
            } else {
                list.scrollTop = 150;
                ChatActionCreators.getMessages(this.props.otherUser.id, this.props.messages.length);
            }
        }
    }

    render() {
        let messages = this.props.messages;
        let otherUsername = this.props.otherUser ? this.props.otherUser.username : '';
        return (
            <div className="view view-main" ref="list" onScroll={this.handleScroll}>
                <LeftMenuTopNavbar centerText={otherUsername}/>
                <div className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        <DailyMessages messages={messages} date={'20160223'}/>
                        <br />
                    </div>
                </div>
                <div>
                    <MessagesToolBar onClickHandler={this.sendMessageHandler}/>
                </div>
            </div>
        );
    }
});