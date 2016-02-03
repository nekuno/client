import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ChipList from './../ui/ChipList';
import selectn from 'selectn';

export default class ThreadContent extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired,
        last: PropTypes.bool.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {
        let thread = this.props.thread;
        let last = this.props.last;
        let userId = this.props.userId;

        return (
            <div className="thread-listed">
                {last ? '' : <div className="threads-vertical-connection"></div>}
                <div className="thread-first-image">
                    {this.renderImage(thread.cached[0], thread.type)}
                </div>
                <div className="thread-info-box">
                    <div className="title thread-title">
                        <Link to={`users/${userId}/recommendations/${thread.id}`}>
                            {thread.name}
                        </Link>
                    </div>
                    <div className="recommendations-count">
                        {thread.totalResults} Contenidos
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => {
                            if(index !== 0) {
                                return <div key={index} className="thread-image">{this.renderImage(item, thread.type)}</div>
                            }
                        })}
                    </div>
                    {this.renderChipList(thread)}
                </div>
            </div>
        );
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
    };

    renderImage = function (recommendation, type) {
        let imgSrc = 'img/default-content-image.jpg';
        if (selectn('thumbnail', recommendation)) {
            imgSrc = recommendation.thumbnail;
        } else if (type === 'Image' && selectn('url', recommendation)) {
            imgSrc = recommendation.url;
        }

        return (
            <img src={imgSrc} />
        );
    };
}
