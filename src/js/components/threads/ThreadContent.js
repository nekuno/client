import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ChipList from './../ui/ChipList';
import selectn from 'selectn';

export default class ThreadContent extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        thread: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired,
        userId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.goToThread = this.goToThread.bind(this);
    }

    render() {
        let thread = this.props.thread;
        let last = this.props.last;
        let type = selectn('type', thread.filters);
        let tag = selectn('tag', thread.filters);

        return (
            <div className="thread-listed" onClick={this.goToThread}>
                {last ? <div className="threads-opposite-vertical-connection"></div> : <div className="threads-vertical-connection"></div>}
                <div className="thread-first-image">
                    {this.renderImage(thread.cached[0], type)}
                </div>
                <div className="thread-info-box">
                    <div className="title thread-title">
                        <a>
                            {thread.name}
                        </a>
                    </div>
                    <div className="recommendations-count">
                        {thread.totalResults} Contenidos
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => {
                            if(index !== 0) {
                                return <div key={index} className="thread-image">{this.renderImage(item, type)}</div>
                            }
                        })}
                    </div>
                    {this.renderChipList(thread, type, tag)}
                </div>
            </div>
        );
    }

    renderChipList = function(thread, types, tag) {
        let chips = [];
        chips.push({'label': 'Contenidos'});

        for (let key in types){
            if (types.hasOwnProperty(key)){
                let type = types[key];
                if (type && type != 'Link') {
                    chips.push({'label': type});
                }
            }
        }

        if (tag) {
            chips.push({'label': tag});
        }

        return (
            <ChipList chips={chips} small={false} />
        );
    };

    renderImage = function (recommendation, type) {
        let imgSrc = 'img/default-content-image.jpg';
        if (selectn('thumbnail', recommendation)) {
            imgSrc = recommendation.thumbnail;
        } else if (type.indexOf('Image') > -1  && selectn('url', recommendation)) {
            imgSrc = recommendation.url;
        }

        return (
            <img src={imgSrc} />
        );
    };

    goToThread() {
        this.context.history.pushState(null, `users/${this.props.userId}/recommendations/${this.props.thread.id}`)
    }
}
