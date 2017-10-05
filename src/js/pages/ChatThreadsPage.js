import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import LastMessage from '../components/ui/LastMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ChatThreadStore from '../stores/ChatThreadStore';
import ChatUserStatusStore from '../stores/ChatUserStatusStore';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import Scroll from "../components/scroll/Scroll";
import ChatActionCreators from '../actions/ChatActionCreators';

function requestData(props) {
    ChatActionCreators.getThreadsMessages(props.offset, props.limit);
}

function getState() {

    const threads = ChatThreadStore.getThreads();
    const offset = ChatThreadStore.getOffset();
    const limit = ChatThreadStore.getLimit();
    const loading = ChatThreadStore.getLoading();
    const noMoreMessages = ChatThreadStore.getNoMoreMessages();
    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || [];

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

    renderMessages() {
        const {threads, onlineUserIds} = this.props;
        return threads.map((thread, key) => {
            return (
                <div key={key}>
                    <LastMessage user={thread.user} message={thread.message} online={onlineUserIds.some(id => id === thread.user.id)}/>
                    <hr />
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
        const {threads, loading, strings} = this.props;

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.title}/>
                <div className="view view-main" id="chat-threads-view-main">
                    <div className="page notifications-page">
                        <div id="page-content" className="notifications-content">
                            {threads.length > 0 ?
                                <Scroll
                                    items={this.renderMessages()}
                                    containerId="chat-threads-view-main"
                                    onLoad={this.onBottomScroll}
                                    loading={loading}
                                    useSpinner={true}
                                />
                                : null}
                        </div>
                    </div>
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