import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import LastMessage from '../components/ui/LastMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import InfiniteAnyHeight from '../components/scroll/InfiniteAnyHeight.jsx';
import ChatThreadStore from '../stores/ChatThreadStore';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import InfiniteScroll from "../components/scroll/InfiniteScroll";

function getState() {

    const threads = ChatThreadStore.getThreads();

    return {
        threads
    };
}

@AuthenticatedComponent
@translate('ChatThreadsPage')
@connectToStores([ChatThreadStore], getState)
export default class ChatThreadsPage extends Component {

    constructor(props) {
        super(props);

        this.renderMessages = this.renderMessages.bind(this);
    }

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        threads: PropTypes.array.isRequired
    };

    renderMessages() {
        return this.props.threads.map((thread, key) => {
            return (
                <div key={key}>
                    <LastMessage user={thread.user} message={thread.message}/>
                    <hr />
                </div>
            )
        })
    }

    render() {

        const {strings} = this.props;

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.title}/>
                <div className="view view-main" id="chat-threads-view-main">
                    <div className="page notifications-page">
                        <div id="page-content" className="notifications-content">
                            <InfiniteScroll
                                list={this.renderMessages()}
                                containerId="chat-threads-view-main"
                                // preloadAdditionalHeight={window.innerHeight*2}
                                // useWindowAsScrollContainer
                            />
                            {/*<InfiniteAnyHeightViewer/>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

ChatThreadsPage.defaultProps = {
    strings: {
        title: 'Messages'
    }
};