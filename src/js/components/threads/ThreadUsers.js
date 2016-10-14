import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import selectn from 'selectn'
import ChipList from './../ui/ChipList';
import Image from './../ui/Image';
import LoadingSpinnerCSS from './../ui/LoadingSpinnerCSS';
import ThreadNoResults from './ThreadNoResults';
import OrientationRequiredPopup from './../ui/OrientationRequiredPopup';
import FilterStore from '../../stores/FilterStore';
import translate from '../../i18n/Translate';

@translate('ThreadUsers')
export default class ThreadUsers extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        thread : PropTypes.object.isRequired,
        last   : PropTypes.bool.isRequired,
        userId : PropTypes.number.isRequired,
        profile: PropTypes.object.isRequired,
        isSomethingWorking: PropTypes.bool,
        filters: PropTypes.object.isRequired,
        avKey  : PropTypes.number.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.renderChipList = this.renderChipList.bind(this);
        this.goToThread = this.goToThread.bind(this);
        this.continue = this.continue.bind(this);
    }

    mergeImagesWithThread(thread) {

        let images = thread.cached.map((item, index) => item.photo ? item.photo.thumbnail.small : `${IMAGES_ROOT}media/cache/profile_picture/bundles/qnoowweb/images/user-no-img.jpg`);

        thread.cached[0] = thread.cached[0] ? thread.cached[0] : [];
        images[0] = thread.cached[0].photo ? thread.cached[0].photo.thumbnail.medium : 'img/no-img/medium.jpg';

        if (images.length == 1 && !thread.cached[0].photo) {
            [1, 2, 3, 4].forEach(index => images[index] = `${IMAGES_ROOT}media/cache/profile_picture/bundles/qnoowweb/images/user-no-img.jpg`);
        }

        images.forEach((item, index) => {
            thread.cached[index] = thread.cached[index] || {};
            thread.cached[index].image = item
        });

        return thread;
    }

    renderChipList(filters, defaultFilters) {
        let strings = this.props.strings;
        let chips = [{'label': strings.people}];
        Object.keys(filters).map(key => {
            chips.push({'label': FilterStore.getFilterLabel(defaultFilters[key], filters[key])});
        });

        return (
            <ChipList chips={chips} small={true}/>
        );
    };

    goToThread() {
        const {thread, profile, isSomethingWorking, strings} = this.props;
        const totalResults = thread.totalResults;
        const mustBeDisabled = thread.disabled || totalResults == 0 && isSomethingWorking;
        if (!selectn('orientation', profile)) {
            nekunoApp.popup('.popup-orientation-required-' + thread.id);
            document.getElementsByClassName('view')[0].scrollTop = 0;
        } else if (mustBeDisabled) {
            nekunoApp.alert(strings.disabled)
        } else if (totalResults == 0) {
            this.context.history.pushState(null, `edit-thread/${thread.id}`)
        } else {
            this.continue();
        }
    }

    continue() {
        this.context.history.pushState(null, `users/${this.props.userId}/recommendations/${this.props.thread.id}`)
    }

    render() {
        const {thread, last, filters, profile, isSomethingWorking, avKey, strings} = this.props;
        const defaultUserImage = 'img/no-img/small.jpg';
        let formattedThread = this.mergeImagesWithThread(thread);
        const totalResults = formattedThread.totalResults;
        const mustBeDisabled = selectn('orientation', profile) && (thread.disabled || totalResults == 0 && isSomethingWorking);
        const threadClass = mustBeDisabled ? "thread-listed thread-disabled" :
            selectn('orientation', profile) && totalResults == 0 ? "thread-listed thread-no-results" : "thread-listed";
        const recommendationsAreLoading = totalResults && !thread.cached.some(item => item.photo);

        return (
            <div className={avKey % 2 ? 'thread-even' : 'thread-odd'}>
                {selectn('orientation', profile) && !mustBeDisabled && totalResults == 0 ?
                    <ThreadNoResults threadId={thread.id} deleting={thread.deleting == true} />
                    : null
                }
                {/*
                <div className="thread-background-image-wrapper">
                    <div className="thread-background-image" style={{background: 'url(' + formattedThread.cached[0].image + ') no-repeat center'}}></div>
                </div>
                */}
                <div className={threadClass} onClick={this.goToThread}>
                    {last ? null : <div className="thread-vertical-connection"></div>}
                    <div className="thread-first-image-wrapper">
                        <div className="thread-first-image-centered-wrapper" style={recommendationsAreLoading ? {backgroundColor: '#555'} : {}}>
                            <div className="thread-first-image" style={recommendationsAreLoading ? {opacity: 0.5} : {}}>
                                <Image src={formattedThread.cached[0].image} defaultSrc={defaultUserImage} />
                            </div>
                            {recommendationsAreLoading ?
                                <LoadingSpinnerCSS /> : null
                            }

                        </div>
                    </div>
                    <div className="thread-info-box">
                        <div className="title thread-title">
                            <a>
                                {formattedThread.name}
                            </a>
                        </div>
                        <div className="recommendations-count">
                            {formattedThread.totalResults} {strings.users}
                        </div>
                        <div className="thread-images">
                            {formattedThread.cached.map((item, index) => index !== 0 && index <= 4 && item.image ?
                                <div key={index} className="thread-image-wrapper"  style={recommendationsAreLoading ? {backgroundColor: '#555'} : {}}>
                                    <div className="thread-image-centered-wrapper">
                                        <div className="thread-image" style={recommendationsAreLoading ? {opacity: 0.5} : {}}>
                                            <Image src={item.image} defaultSrc={defaultUserImage} />
                                        </div>
                                        {/*recommendationsAreLoading ?
                                            <LoadingSpinnerCSS small={true}/> : null
                                        */}
                                    </div>
                                </div>
                                : '')}
                        </div>
                        <span>{strings.filters}</span>
                        {this.renderChipList(formattedThread.filters.userFilters, filters.userFilters)}
                    </div>
                </div>
                <OrientationRequiredPopup profile={profile} onContinue={this.continue} threadId={thread.id}/>
            </div>

        );
    }

}

ThreadUsers.defaultProps = {
    strings: {
        people  : 'People',
        users   : 'Users',
        disabled: 'We are weaving this yarn, please wait a moment...',
        filters : 'Filters: '
    }
};