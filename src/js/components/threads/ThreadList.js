import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import ThreadContent from './ThreadContent';
import ThreadUsers from './ThreadUsers';

export default class ThreadList extends Component {
    static propTypes = {
        threads: PropTypes.array.isRequired,
        userId: PropTypes.number.isRequired,
        profile: PropTypes.object.isRequired,
        filters: PropTypes.object.isRequired,
        isSomethingWorking: PropTypes.bool
    };

    render() {
        let {threads, userId, profile, filters, isSomethingWorking} = this.props;
        const threadsLength = Object.keys(threads).length;
        return (
            <div>
                {Object.keys(threads).map((key, index) =>
                    threads[key].category === 'ThreadUsers' ?
                        <ThreadUsers key={key} avKey={index} thread={threads[key]} last={index + 1 == threadsLength}
                                     userId={userId} profile={profile} isSomethingWorking={isSomethingWorking}
                                     filters={filters}/>
                        :
                        <ThreadContent key={key} avKey={index} thread={threads[key]}
                                       last={index + 1 == threadsLength} userId={userId} filters={filters}
                                       isSomethingWorking={isSomethingWorking}/>
                )}
            </div>
        );
    }
}
