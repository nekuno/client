import React, { PropTypes, Component } from 'react';
import FilterStore from '../../stores/FilterStore';
import ChipList from './../ui/ChipList';
import Image from './../ui/Image';
import LoadingSpinnerCSS from './../ui/LoadingSpinnerCSS';
import ThreadNoResults from './ThreadNoResults';
import translate from '../../i18n/Translate';
import selectn from 'selectn';

@translate('ThreadContent')
export default class ThreadContent extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        thread : PropTypes.object.isRequired,
        last   : PropTypes.bool.isRequired,
        userId : PropTypes.number.isRequired,
        isSomethingWorking: PropTypes.bool,
        avKey  : PropTypes.number.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.renderChipList = this.renderChipList.bind(this);
        this.goToThread = this.goToThread.bind(this);
    }

    defaultImage = 'img/default-content-image.jpg';

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
        const imgSrc = this.getImage(recommendation);
        return (
            <Image src={imgSrc} defaultSrc={this.getDefaultImage()}/>
        );
    };

    getImage = function(recommendation) {
        if (recommendation && recommendation.staticThumbnail) {
            return recommendation.staticThumbnail;
        } else if (recommendation && recommendation.content && recommendation.content.thumbnail) {
            return recommendation.content.thumbnail;
        } else if (recommendation && recommendation.content && recommendation.content.url && recommendation.content.url.match(/\.(jpe?g|gif|png|bmp|svg)$/i) != null) {
            return recommendation.content.url;
        }

        return this.getDefaultImage();
    };

    getDefaultImage() {
        return this.defaultImage;
    }

    goToThread() {
        const {userId, thread, isSomethingWorking, strings} = this.props;
        const totalResults = thread.totalResults;
        const mustBeDisabled = thread.disabled || totalResults == 0 && isSomethingWorking;
        if (mustBeDisabled) {
            nekunoApp.alert(strings.disabled)
        } else if (totalResults == 0) {
            this.context.history.pushState(null, `edit-thread/${thread.id}`)
        } else {
            this.context.history.pushState(null, `users/${userId}/recommendations/${thread.id}`)
        }
    }

    render() {
        let {thread, last, filters, isSomethingWorking, avKey, strings} = this.props;
        const totalResults = thread.totalResults;
        const mustBeDisabled = thread.disabled || totalResults == 0 && isSomethingWorking;
        const threadClass = mustBeDisabled ? "thread-listed thread-disabled" :
            totalResults == 0 ? "thread-listed thread-no-results" : "thread-listed";
        const recommendationsAreLoading = totalResults && !thread.cached.some(item => item.content);

        return (
            <div className={avKey % 2 ? 'thread-even' : 'thread-odd'}>
                {!mustBeDisabled && totalResults == 0 ?
                    <ThreadNoResults threadId={thread.id} deleting={thread.deleting == true} />
                    : null
                }
                <div className="thread-background-image-wrapper">
                    <div className="thread-background-image" style={{background: 'url(' + this.getImage(selectn('cached[0]', thread)) + ') no-repeat center'}}></div>
                </div>
                <div className={threadClass} onClick={this.goToThread}>
                    {last ? null : <div className="thread-vertical-connection"></div>}
                    <div className="thread-first-image-wrapper">
                        <div className="thread-first-image-centered-wrapper" style={recommendationsAreLoading ? {backgroundColor: '#555'} : {}}>
                            <div className="thread-first-image" style={recommendationsAreLoading ? {opacity: 0.5} : {}}>
                                {this.renderImage(selectn('cached[0]', thread))}
                            </div>
                            {recommendationsAreLoading ?
                                <LoadingSpinnerCSS /> : null
                            }
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
                            {thread.cached.length > 1 ?
                                thread.cached.map((item, index) => {
                                    if (index !== 0 && index <= 4) {
                                        return <div key={index} className="thread-image-wrapper">
                                            <div className="thread-image-centered-wrapper">
                                                <div className="thread-image">{this.renderImage(item)}</div>
                                            </div>
                                        </div>
                                    }
                                })
                                :
                                [1, 2, 3, 4].map(index =>
                                    <div key={index} className="thread-image-wrapper" style={recommendationsAreLoading ? {backgroundColor: '#555'} : {}}>
                                        <div className="thread-image-centered-wrapper">
                                            <div className="thread-image" style={recommendationsAreLoading ? {opacity: 0.5} : {}}>{this.renderImage(null)}</div>
                                            {/*recommendationsAreLoading ?
                                                <LoadingSpinnerCSS small={true}/> : null
                                            */}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {this.renderChipList(thread.filters.contentFilters, filters.contentFilters)}
                    </div>
                </div>
            </div>
        );
    }

}

ThreadContent.defaultProps = {
    strings: {
        contents: 'Contents',
        disabled: 'We are weaving this yarn, please wait a moment...',
    }
};