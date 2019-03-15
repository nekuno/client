import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DailyMessages from '../components/ui/DailyMessages/DailyMessages';
import MessagesToolBar from '../components/MessagesToolBar/MessagesToolBar';
import MessagesToolBarDisabled from '../components/ui/MessagesToolBarDisabled/MessagesToolBarDisabled';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ChatActionCreators from '../actions/ChatActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import LoginStore from '../stores/LoginStore';
import UserStore from '../stores/UserStore';
import BlockStore from '../stores/BlockStore';
import ChatMessageStore from '../stores/ChatMessageStore';
import ChatUserStatusStore from '../stores/ChatUserStatusStore';
import '../../scss/pages/chat-messages.scss';
import TopNavBar from '../components/TopNavBar/TopNavBar';

function parseUserId(user) {
    return user ? user.id : null;
}

function requestData(props) {
    const otherUserSlug = props.params.slug;
    const messages = getMessages(otherUserSlug);
    if (messages.length === 0) {
        const requiredFields = ['username', 'photo', 'status'];
        UserActionCreators.requestUser(otherUserSlug, requiredFields);
    }
}

function getCanContact(user) {
    const otherUserId = parseUserId(user);

    const anyBlocked = otherUserId ? BlockStore.getBidirectional(LoginStore.user.id, otherUserId) : false;
    const isOtherEnabled = user ? user.enabled : false;

    return !anyBlocked && isOtherEnabled;
}

function getState(props) {
    const otherUserSlug = props.params.slug;
    const messages = getMessages(otherUserSlug);
    const otherUser = getOtherUser(messages, otherUserSlug);
    const otherUserId = parseUserId(otherUser);
    const online = otherUserId ? ChatUserStatusStore.isOnline(otherUserId) || false : false;

    const canContact = getCanContact(otherUser);

    return {
        otherUserId,
        messages,
        otherUser,
        online,
        canContact
    };
}

function getMessages(otherUserSlug) {
    return otherUserSlug ? ChatMessageStore.getAllForSlug(otherUserSlug) : [];
}

function getOtherUser(messages, otherUserSlug) {
    if (messages.length === 0) {
        return UserStore.getBySlug(otherUserSlug);
    }

    const ownSlug = LoginStore.user.slug;
    let otherUser = {};

    messages.some(message => {
        if (message.user_from.slug !== ownSlug) {
            otherUser = message.user_from;
            return true;
        }
        if (message.user_to.slug !== ownSlug) {
            otherUser = message.user_to;
            return true;
        }
        return false;
    });

    return otherUser;
}

@AuthenticatedComponent
@translate('ChatMessagesPage')
@connectToStores([ChatMessageStore, ChatUserStatusStore, LoginStore, UserStore, BlockStore], getState)
export default class ChatMessagesPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params     : PropTypes.shape({
            slug: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user       : PropTypes.object.isRequired,
        isGuest    : PropTypes.bool.isRequired,
        // Injected by @translate:
        strings    : PropTypes.object,
        // Injected by @connectToStores:
        messages   : PropTypes.array.isRequired,
        otherUserId: PropTypes.number,
        otherUser  : PropTypes.object,
        online     : PropTypes.bool,
        canContact : PropTypes.bool

    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.markReaded = this.markReaded.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.goToProfilePage = this.goToProfilePage.bind(this);
        this.goToChatThreadsPage = this.goToChatThreadsPage.bind(this);
        this.scrollIfNeeded = this.scrollIfNeeded.bind(this);

        this.state = {
            noMoreMessages: null,
            timestamp     : null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidMount() {
        this._scrollToBottom();
        this.markReaded();
        this.refs.list.addEventListener('scroll', this.handleScroll, false);
        window.addEventListener('resize', this.scrollIfNeeded, false);
    }

    componentWillUnmount() {
        this.refs.list.removeEventListener('scroll', this.handleScroll, false);
        window.removeEventListener('resize', this.scrollIfNeeded, false);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.otherUser && !this.props.otherUser) {
            window.setTimeout(() => {
                UserActionCreators.requestBlockUser(LoginStore.user.slug, nextProps.otherUser.slug)
            }, 0);
        }
    }

    componentDidUpdate(prevProps) {
        this.refs.list.scrollTop = 500;
        if (this.props.otherUserId && (!prevProps.otherUserId || ChatMessageStore.isFresh(this.props.otherUserId))) {
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
        const userId = this.props.otherUserId;
        ChatActionCreators.sendMessage(userId, messageText);
    }

    handleFocus() {

    }

    markReaded() {
        const {otherUserId, messages} = this.props;
        if (otherUserId && messages.length > 0) {
            let lastMessage = messages[messages.length - 1];
            let timestamp = lastMessage.createdAt.toISOString();
            if (!this.state.timestamp || this.state.timestamp < timestamp) {
                window.setTimeout(() => ChatActionCreators.markAsReaded(otherUserId, timestamp), 0);
                this.setState({timestamp});
            }
        }
    }

    handleScroll() {
        let list = this.refs.list;
        const {otherUserId, messages} = this.props;
        if (otherUserId && list.scrollTop === 0) {
            if (ChatMessageStore.noMoreMessages(otherUserId)) {
                list.removeEventListener('scroll', this.handleScroll, false);
                this.setState({noMoreMessages: true});
            } else {
                list.scrollTop = 1;
                ChatActionCreators.getMessages(otherUserId, messages.length);
            }
        }
    }

    goToChatThreadsPage() {
        const {params} = this.props;
        this.context.router.push(`conversations`);
    }

    goToProfilePage() {
        const {params} = this.props;
        this.context.router.push(`p/${params.slug}`);
    }

    render() {
        const {user, otherUser, messages, online, strings, params, isGuest, canContact} = this.props;

        let otherUsername = otherUser ? otherUser.username : '';
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        let otherUserImgSrc = otherUser && otherUser.photo ? otherUser.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div className="view view-main notifications-view">
                    <TopNavBar
                        background={'white'}
                        iconLeft={'arrow-left'}
                        textCenter={otherUsername}
                        textSize={'small'}
                        imageRight={otherUserImgSrc}
                        onLeftLinkClickHandler={this.goToChatThreadsPage}
                        onRightLinkClickHandler={this.goToProfilePage}
                        online={online}/>

                    <div className="notifications-wrapper" ref="list">
                        {this.state.noMoreMessages ? <div className="daily-message-title">{strings.noMoreMessages}</div> : '' }
                        <DailyMessages messages={messages} userLink={`p/${params.slug}`} enabled={canContact}/>
                    </div>
                    { isGuest ? '' :
                        canContact ?
                            <MessagesToolBar onClickHandler={this.sendMessageHandler} onFocusHandler={this.handleFocus} placeholder={strings.placeholder} text={strings.text} image={imgSrc}/>
                            :
                            <MessagesToolBarDisabled text={strings.text}/>
                    }
                </div>
            </div>
        );
    }
}

ChatMessagesPage.defaultProps = {
    strings: {
        noMoreMessages: 'You have no messages',
        placeholder   : 'Type a message...',
        text          : 'Send'
    }
};
