import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import DailyMessages from '../components/ui/DailyMessages';
import MessagesToolBar from '../components/ui/MessagesToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import ChatActionCreators from '../actions/ChatActionCreators';
import UserStore from '../stores/UserStore';
import ChatMessageStore from '../stores/ChatMessageStore';

function requestData(props) {
    const userId = props.params.userId;
    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
}

function getState(props) {

    const otherUserId = props.params.userId;
    const messages = ChatMessageStore.getAllForUser(otherUserId);
    const otherUser = UserStore.get(otherUserId);

    return {
        otherUserId,
        messages,
        otherUser
    };
}

@AuthenticatedComponent
@translate('ChatMessagesPage')
@connectToStores([ChatMessageStore, UserStore], getState)
export default class ChatMessagesPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params     : PropTypes.shape({
            userId: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user       : PropTypes.object.isRequired,
        isGuest    : PropTypes.bool.isRequired,
        // Injected by @translate:
        strings    : PropTypes.object,
        // Injected by @connectToStores:
        messages   : PropTypes.array.isRequired,
        otherUserId: PropTypes.string,
        otherUser  : PropTypes.object

    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.goToProfilePage = this.goToProfilePage.bind(this);

        this.state = {
            noMoreMessages: false
        };
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
        const userId = this.props.params.userId;
        ChatActionCreators.sendMessage(userId, messageText);
    }

    handleFocus(e) {
        if (this.props.messages.length > 0) {
            const userId = parseInt(this.props.params.userId);
            let lastMessage = this.props.messages[this.props.messages.length - 1];
            let timestamp = lastMessage.createdAt.toISOString();
            ChatActionCreators.markAsReaded(userId, timestamp);
        }
    }

    handleScroll() {
        var list = this.refs.list;
        if (list.scrollTop === 0) {
            if (ChatMessageStore.noMoreMessages(this.props.params.userId)) {
                list.removeEventListener('scroll', this.handleScroll);
                this.setState({noMoreMessages: true});
            } else {
                list.scrollTop = 150;
                ChatActionCreators.getMessages(this.props.otherUser.id, this.props.messages.length);
            }
        }
    }

    goToProfilePage() {
        const {otherUserId} = this.props;
        this.context.history.pushState(null, `profile/${otherUserId}`)
    }

    render() {
        const {otherUser, messages, strings, isGuest} = this.props;
        let otherUsername = otherUser ? otherUser.username : '';
        return (

            <div className="view view-main" ref="list" onScroll={this.handleScroll}>
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUsername} onCenterLinkClickHandler={this.goToProfilePage}/>
                <div className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        {this.state.noMoreMessages ? <div className="daily-message-title">{strings.noMoreMessages}</div> : '' }
                        <DailyMessages messages={messages}/>
                        <br />
                        <br />
                    </div>
                </div>
                <div>
                    { isGuest ? '' : <MessagesToolBar onClickHandler={this.sendMessageHandler} onFocusHandler={this.handleFocus} placeholder={strings.placeholder} text={strings.text}/> }
                </div>
            </div>
        );
    }
};

ChatMessagesPage.defaultProps = {
    strings: {
        noMoreMessages: 'You have no messages',
        placeholder   : 'Type a message...',
        text          : 'Send'
    }
};