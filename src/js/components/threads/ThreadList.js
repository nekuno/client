import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import ThreadContent from './ThreadContent';
import ThreadUsers from './ThreadUsers';

export default class ThreadList extends Component {
    static propTypes = {
        threads: PropTypes.object.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let threadList = [];
        let threadsLength = this.getObjectLength(this.props.threads);
        let counter = 0;
        for (let threadId in this.props.threads) {
            let thread = selectn('threads['+threadId+']', this.props);
            if (thread) {
                threadList[counter++] = thread.category === 'ThreadUsers' ?
                    <ThreadUsers thread={thread} last={counter == threadsLength} /> :
                    <ThreadContent thread={thread} last={counter == threadsLength} />;
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
