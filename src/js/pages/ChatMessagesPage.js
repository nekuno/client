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
import ChatUserStatusStore from '../stores/ChatUserStatusStore';

function requestData(props) {
    const userId = props.params.userId;
    UserActionCreators.requestUser(userId, ['username', 'photo', 'status']);
}

function getState(props) {

    const otherUserId = props.params.userId;
    const messages = ChatMessageStore.getAllForUser(otherUserId);
    const otherUser = UserStore.get(otherUserId);
    const online = ChatUserStatusStore.isOnline(otherUserId) || false;

    return {
        otherUserId,
        messages,
        otherUser,
        online
    };
}

@AuthenticatedComponent
@translate('ChatMessagesPage')
@connectToStores([ChatMessageStore, ChatUserStatusStore, UserStore], getState)
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
        otherUser  : PropTypes.object,
        online     : PropTypes.bool

    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.markReaded = this.markReaded.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.goToProfilePage = this.goToProfilePage.bind(this);
        this.scrollIfNeeded = this.scrollIfNeeded.bind(this);

        this.state = {
            noMoreMessages: ChatMessageStore.noMoreMessages(props.params.userId),
            timestamp     : null
        };
    }

    componentDidMount() {
        requestData(this.props);
        this._scrollToBottom();
        this.markReaded();
        if (!ChatMessageStore.noMoreMessages(this.props.params.userId)) {
            this.refs.list.addEventListener('scroll', this.handleScroll, false);
        }
        window.addEventListener('resize', this.scrollIfNeeded, false);
    }

    componentWillUnmount() {
        this.refs.list.removeEventListener('scroll', this.handleScroll, false);
        window.removeEventListener('resize', this.scrollIfNeeded, false);
    }

    componentDidUpdate() {
        if (ChatMessageStore.isFresh(this.props.params.userId)) {
            this._scrollToBottom();
            this.markReaded();
        }
    }

    scrollIfNeeded() {
        let list = this.refs.list;
        if (list.scrollTop * 4 >= list.scrollHeight) {
            this._scrollToBottom();
        }
    }

    _scrollToBottom() {
        let list = this.refs.list;
        window.setTimeout(() => {
            list.scrollTop = list.scrollHeight;
        }, 0);
    }

    sendMessageHandler(messageText) {
        const userId = this.props.params.userId;
        ChatActionCreators.sendMessage(userId, messageText);
    }

    handleFocus() {

    }

    markReaded() {
        if (this.props.messages.length > 0) {
            const userId = parseInt(this.props.params.userId);
            let lastMessage = this.props.messages[this.props.messages.length - 1];
            let timestamp = lastMessage.createdAt.toISOString();
            if (!this.state.timestamp || this.state.timestamp < timestamp) {
                window.setTimeout(() => ChatActionCreators.markAsReaded(userId, timestamp), 0);
                this.setState({timestamp});
            }
        }
    }

    handleScroll() {
        var list = this.refs.list;
        if (list.scrollTop === 0) {
            if (ChatMessageStore.noMoreMessages(this.props.params.userId)) {
                list.removeEventListener('scroll', this.handleScroll, false);
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
        const {otherUser, messages, online, strings, isGuest} = this.props;
        let otherUsername = otherUser ? otherUser.username : '';
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUsername} bottomText={online ? 'Online' : null} onCenterLinkClickHandler={this.goToProfilePage}/>
                <div className="view view-main notifications-view">
                    <div className="page toolbar-fixed notifications-page">
                        { isGuest ? '' : <MessagesToolBar onClickHandler={this.sendMessageHandler} onFocusHandler={this.handleFocus} placeholder={strings.placeholder} text={strings.text}/> }
                        <div id="page-content" className="page-content notifications-content messages-content" ref="list">
                            {this.state.noMoreMessages ? <div className="daily-message-title">{strings.noMoreMessages}</div> : '' }
                            <DailyMessages messages={messages}/>
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
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