import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import ThreadStore from '../stores/ThreadStore';
import Thread from '../components/thread/Thread';
import connectToStores from '../utils/connectToStores';

function parseLogin(params) {
    return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const userLogin = parseLogin(params);

    UserActionCreators.requestThreads(userLogin);

}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threads = ThreadStore.getAll();

    return {
        threads
    };
}

@connectToStores([ThreadStore], getState)
export default class ThreadPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            login: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        threads: PropTypes.object
    };

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
            requestData(nextProps);
        }
    }

    render() {
        if (!this.props.threads['22151']){
            return null;
        }

        return (
            <div style={{backgroundColor: '#FFFFFF'}}>

                Threads for user {this.props.params.login} <br/>

                Foreach this.props.threads (each key it´s the id of the thread}: <br/>

                Id: {this.props.threads['22151'].id}<br/>
                Name: {this.props.threads['22151'].name}<br/>
                Category: {this.props.threads['22151'].category} (2 possible, ThreadUsers and ThreadContent)<br/>

                Image (for ThreadUsers): {this.props.threads['22151'].cached[0].image} (is null here because only user5 have image); <br/>
                Thumbnail (for ThreadContent): {this.props.threads['22152'].cached[0].thumbnail};
            </div>
        );
    }
}
