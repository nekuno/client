import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import LastMessage from '../components/ui/LastMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ChatThreadStore from '../stores/ChatThreadStore';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';

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

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        threads: PropTypes.array.isRequired
    };

    render() {

        const {threads, strings} = this.props;

        return (
            <div className="view view-main">
                <TopNavBar leftMenuIcon={true} centerText={strings.title}/>
                <div className="page notifications-page">
                    <div id="page-content" className="notifications-content">
                        {
                            threads.map((thread, key) => {
                                return (
                                    <div key={key}>
                                        <LastMessage user={thread.user} message={thread.message}/>
                                        <hr />
                                    </div>
                                )
                            })
                        }
                        <hr />
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