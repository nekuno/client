import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import ChipList from './../ui/ChipList';

export default class ThreadContent extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let thread = this.props.thread;
        return (
            <div className="thread-listed">
                <div className="first-user-image">
                    <img src={thread.cached[0].thumbnail} />
                </div>
                <div className="thread-title">
                    {thread.name}
                </div>
                {this.renderChipList(thread)}
            </div>
        );
    }

    renderChipList(thread) {
        let chips = [];
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
