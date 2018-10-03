import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import LastMessage from '../components/ui/LastMessage/LastMessage.js';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ChatThreadStore from '../stores/ChatThreadStore';
import ChatUserStatusStore from '../stores/ChatUserStatusStore';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import Scroll from "../components/scroll/Scroll";
import ChatActionCreators from '../actions/ChatActionCreators';
import '../../scss/pages/chat-threads.scss';

function requestData(props) {
    ChatActionCreators.getThreadsMessages(props.offset, props.limit);
}

function getState() {

    const offset = ChatThreadStore.getOffset();
    const limit = ChatThreadStore.getLimit();
    const loading = ChatThreadStore.getLoading();
    const noMoreMessages = ChatThreadStore.getNoMoreMessages();
    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || [];
    //const threads = ChatThreadStore.getThreads();
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const threads = [
        {
            message: {
                text: 'Lorm ipsum',
                createdAt: today
            },
            user: {
                username: 'JohnDoe',
                slug: 'johndoe',
                photo: {
                    thumbnail: {
                        medium: 'http://via.placeholder.com/100x100/928BFF'
                    }
                }
            },
            proposalType: "professional-project"
        },
        {
            message: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                createdAt: yesterday
            },
            user: {
                username: 'JaneDoe',
                slug: 'janedoe',
                photo: {
                    thumbnail: {
                        medium: 'http://via.placeholder.com/100x100/818FA1'
                    }
                }
            }
        },
        {
            message: {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
                createdAt: yesterday
            },
            user: {
                username: 'TomDoe',
                slug: 'tomdoe',
                photo: {
                    thumbnail: {
                        medium: 'http://via.placeholder.com/100x100/63CAFF'
                    }
                }
            },
            proposalType: "leisure-plan"
        }
    ];

    return {
        threads,
        offset,
        limit,
        loading,
        noMoreMessages,
        onlineUserIds
    };
}

@AuthenticatedComponent
@translate('ChatThreadsPage')
@connectToStores([ChatThreadStore, ChatUserStatusStore], getState)
export default class ChatThreadsPage extends Component {

    constructor(props) {
        super(props);

        this.renderMessages = this.renderMessages.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.goToUserMessagesPage = this.goToUserMessagesPage.bind(this);
        this.goToUserPage = this.goToUserPage.bind(this);
    }

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user          : PropTypes.object.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object,
        // Injected by @connectToStores:
        threads       : PropTypes.array.isRequired,
        offset        : PropTypes.number.isRequired,
        loading       : PropTypes.bool.isRequired,
        limit         : PropTypes.number.isRequired,
        noMoreMessages: PropTypes.bool.isRequired,
        onlineUserIds : PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    goToUserMessagesPage(slug) {
        this.context.router.push(`/conversations/${slug}`);
    }

    goToUserPage(slug) {
        this.context.router.push(`/p/${slug}`);
    }

    renderMessages() {
        const {threads, onlineUserIds} = this.props;

        return threads.map((thread, key) => {
            let imgSrc = thread.user.photo ? thread.user.photo.thumbnail.medium : 'img/no-img/medium.jpg';
            return (
                <div key={key}>
                    <LastMessage
                        username={thread.user.username}
                        slug={thread.user.slug}
                        photo={imgSrc}
                        message={thread.message}
                        proposalType={thread.proposalType}
                        online={onlineUserIds.some(id => id === thread.user.id)}
                        onClickHandler={this.goToUserMessagesPage}
                        onUserClickHandler={this.goToUserPage}
                    />
                </div>
            )
        })
    }

    onBottomScroll() {
        if (!this.props.noMoreMessages && !this.props.loading) {
            requestData(this.props);
        }
    }

    render() {
        const {user, threads, loading, notifications, strings} = this.props;
        const imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div  id="chat-threads-view" className="view view-main chat-threads-view">
                    <TopNavBar textCenter={strings.title} imageLeft={imgSrc} boxShadow={true}/>
                    <div className="chat-threads-wrapper">
                        {threads.length > 0 ?
                            <Scroll
                                items={this.renderMessages()}
                                containerId="chat-threads-view"
                                onLoad={this.onBottomScroll}
                                loading={loading}
                                useSpinner={true}
                            />
                            : null}
                    </div>
                    <BottomNavBar current={'messages'} notifications={notifications}/>
                </div>
            </div>
        );
    }
}

ChatThreadsPage.defaultProps = {
    strings: {
        title: 'Messages'
    }
};