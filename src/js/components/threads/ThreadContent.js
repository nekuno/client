import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import ChipList from './../ui/ChipList';

export default class ThreadContent extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        thread: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.handleGoClickThread = this.handleGoClickThread.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let thread = this.props.thread;
        let last = this.props.last;
        return (
            <div className="thread-listed">
                {last ? '' : <div className="threads-vertical-connection"></div>}
                <div className="thread-first-image">
                    <img src={thread.cached[0].thumbnail} />
                </div>
                <div className="thread-info-box">
                    <div className="thread-title">
                        <Link to={`users/1/recommendations/${thread.id}`} onClick={this.handleGoClickThread.bind(this, thread.id)}>
                            {thread.name}
                        </Link>
                    </div>
                    <div className="recommendations-count">
                        {thread.totalResults} Contenidos
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => index !== 0 && item.thumbnail ?
                            <div className="thread-image"><img src={item.thumbnail} /></div> : '')}
                    </div>
                    {this.renderChipList(thread)}
                </div>
            </div>
        );
    }

    handleGoClickThread(threadId) {
        this.context.history.pushState(null, `users/1/recommendations/${threadId}`);
    }

    renderChipList = function(thread) {
        let chips = [];
        chips.push({'label': 'Contenidos'});
        if (thread.type) {
            chips.push({'label': thread.type});
        }
        if (thread.tag) {
            chips.push({'label': thread.tag});
        }

        return (
            <ChipList chips={chips} small={false} />
        );
    }
}
