import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import ThreadContent from './ThreadContent';
import ThreadUsers from './ThreadUsers';

export default class ThreadList extends Component {
    static propTypes = {
        threads: PropTypes.array.isRequired,
        userId: PropTypes.number.isRequired,
        profile: PropTypes.object.isRequired,
        filters: PropTypes.object.isRequired
    };

    render() {
        let threadList = [];
        let threadsLength = this.getObjectLength(this.props.threads);
        let counter = 0;
        for (let threadId in this.props.threads) {
            if (!this.props.threads.hasOwnProperty(threadId)){
                continue;
            }
            let thread = selectn('threads['+threadId+']', this.props);
            if (thread && thread.hasOwnProperty('name')) {
                threadList[counter++] = thread.category === 'ThreadUsers' ?
                    <ThreadUsers key={threadId} thread={thread} last={counter == threadsLength} userId={this.props.userId} profile={this.props.profile} filters={this.props.filters}/> :
                    <ThreadContent key={threadId} thread={thread} last={counter == threadsLength} userId={this.props.userId} filters={this.props.filters}/>;
            }
        }

        return (
            <div>
                {threadList.map(thread => thread)}
            </div>
        );
    }

    getObjectLength = function(obj) {
        let size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

}
