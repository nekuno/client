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
                <div className="thread-first-image">
                    <img src={thread.cached[0].thumbnail} />
                </div>
                <div className="thread-info-box">
                    <div className="thread-title">
                        {thread.name}
                    </div>
                    <div className="recommendations-count">
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
