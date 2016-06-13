import React, { PropTypes, Component } from 'react';
import FilterStore from '../../stores/FilterStore';
import ChipList from './../ui/ChipList';
import Image from './../ui/Image';
import translate from '../../i18n/Translate';

@translate('ThreadContent')
export default class ThreadContent extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        thread : PropTypes.object.isRequired,
        last   : PropTypes.bool.isRequired,
        userId : PropTypes.number.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.renderChipList = this.renderChipList.bind(this);
        this.goToThread = this.goToThread.bind(this);
    }

    renderChipList(filters, defaultFilters) {
        let strings = this.props.strings;
        let chips = [];
        chips.push({'label': strings.contents});

        Object.keys(filters).map(key => {
            chips.push({'label': FilterStore.getFilterLabel(defaultFilters[key], filters[key])});
        });

        return (
            <ChipList chips={chips} small={false}/>
        );
    };

    renderImage = function(recommendation) {
        const defaultImage = 'img/default-content-image.jpg';
        let imgSrc = defaultImage;
        if (recommendation && recommendation.thumbnail) {
            imgSrc = recommendation.thumbnail;
        } else if (recommendation && recommendation.url && recommendation.url.match(/\.(jpe?g|gif|png)$/) != null) {
            imgSrc = recommendation.url;
        }

        return (
            <Image src={imgSrc} defaultSrc={defaultImage}/>
        );
    };

    goToThread() {
        this.context.history.pushState(null, `users/${this.props.userId}/recommendations/${this.props.thread.id}`)
    }

    render() {
        let {thread, last, filters, strings} = this.props;
        return (
            <div className="thread-listed" onClick={this.goToThread}>
                {last ? <div className="threads-opposite-vertical-connection"></div> : ''}
                <div className="thread-first-image-wrapper">
                    <div className="thread-first-image-centered-wrapper">
                        <div className="thread-first-image">
                            {this.renderImage(thread.cached[0])}
                        </div>
                    </div>
                </div>
                <div className="thread-info-box">
                    <div className="title thread-title">
                        <a>
                            {thread.name}
                        </a>
                    </div>
                    <div className="recommendations-count">
                        {thread.totalResults} {strings.contents}
                    </div>
                    <div className="thread-images">
                        {thread.cached.map((item, index) => {
                            if (index !== 0) {
                                return <div key={index} className="thread-image-wrapper"><div className="thread-image-centered-wrapper"><div className="thread-image">{this.renderImage(item)}</div></div></div>
                            }
                        })}
                    </div>
                    {this.renderChipList(thread.filters.contentFilters, filters.contentFilters)}
                </div>
            </div>
        );
    }

}

ThreadContent.defaultProps = {
    strings: {
        contents: 'Contents'
    }
};