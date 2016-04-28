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
        let {threads, userId, profile, filters} = this.props;
        const threadsLength = Object.keys(threads).length;
        return (
            <div>
                {threadsLength > 0 ? <div className="threads-vertical-connection"></div> : ''}
                {Object.keys(threads).map((key, index) => threads[key].category === 'ThreadUsers' ?
                    <ThreadUsers key={key} thread={threads[key]} last={index + 1 == threadsLength} userId={userId} profile={profile} filters={filters}/>
                    :
                    <ThreadContent key={key} thread={threads[key]} last={index + 1 == threadsLength} userId={userId} filters={filters}/>
                )}
            </div>
        );
    }
}
