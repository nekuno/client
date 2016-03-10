import React, { PropTypes, Component } from 'react';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import LastMessage from '../components/ui/LastMessage';
import ChatThreadStore from '../stores/ChatThreadStore';
import connectToStores from '../utils/connectToStores';

function getState() {

    const threads = ChatThreadStore.getThreads();

    return {
        threads
    };
}

@connectToStores([ChatThreadStore], getState)
export default AuthenticatedComponent(class NotificationsPage extends Component {

    static propTypes = {
        // Injected by @connectToStores:
        threads: PropTypes.array.isRequired
    };

    render() {

        let threads = this.props.threads;

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mensajes'}/>
                <div data-page="index" className="page notifications-page">
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
});