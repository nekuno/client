import React, { PropTypes, Component } from 'react';
import FilterStore from '../../stores/FilterStore';
import ChipList from './../ui/ChipList';

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
        let {thread, last, filters} = this.props;
        return (
            <div className="thread-listed" onClick={this.goToThread}>
                {last ? <div className="threads-opposite-vertical-connection"></div> : <div className="threads-vertical-connection"></div>}
                <div className="thread-first-image">
                    {this.renderImage(thread.cached[0])}
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
                            if (index !== 0) {
                                return <div key={index} className="thread-image">{this.renderImage(item)}</div>
                            }
                        })}
                    </div>
                    {this.renderChipList(thread.filters.contentFilters, filters.contentFilters)}
                </div>
            </div>
        );
    }

    renderChipList = function(filters, defaultFilters) {
        let chips = [];
        chips.push({'label': 'Contenidos'});

        Object.keys(filters).map(key => {
            chips.push({'label': FilterStore.getFilterLabel(defaultFilters[key], filters[key])});
        });

        return (
            <ChipList chips={chips} small={false} />
        );
    };

    renderImage = function (recommendation) {
        let imgSrc = 'img/default-content-image.jpg';
        if (recommendation.thumbnail) {
            imgSrc = recommendation.thumbnail;
        } else if (recommendation.url && recommendation.url.match(/\.(jpe?g|gif|png)$/) != null) {
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
