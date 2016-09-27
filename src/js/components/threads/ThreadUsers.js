import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import selectn from 'selectn'
import ChipList from './../ui/ChipList';
import Image from './../ui/Image';
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
        const defaultImage = `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        let images = thread.cached.map((item, index) => item.picture ?
            `${IMAGES_ROOT}media/cache/resolve/profile_picture/user/images/${item.picture}` :
            defaultImage
        );

        thread.cached[0] = thread.cached[0] ? thread.cached[0] : [];
        images[0] = thread.cached[0].picture ?
            `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${thread.cached[0].picture}` :
            defaultImage;

        if (images.length == 1 && !thread.cached[0].picture) {
            [1, 2, 3, 4].forEach(index => images[index] = defaultImage);
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
            <ChipList chips={chips} small={false}/>
        );
    };

    goToThread() {
        const {thread, profile, isSomethingWorking, strings} = this.props;
        const totalResults = thread.totalResults;
        const mustBeDisabled = thread.disabled || totalResults == 0 && isSomethingWorking;
        if (!selectn('orientation', profile)) {
            nekunoApp.popup('.popup-orientation-required');
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
        const defaultUserImage = `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        let formattedThread = this.mergeImagesWithThread(thread);
        const totalResults = formattedThread.totalResults;
        const mustBeDisabled = selectn('orientation', profile) && (thread.disabled || totalResults == 0 && isSomethingWorking);
        const threadClass = mustBeDisabled ? "thread-listed thread-disabled" :
            selectn('orientation', profile) && totalResults == 0 ? "thread-listed thread-no-results" : "thread-listed";
        return (
            <div className={avKey % 2 ? '' : 'thread-odd'}>
                {selectn('orientation', profile) && !mustBeDisabled && totalResults == 0 ?
                    <ThreadNoResults threadId={thread.id} deleting={thread.deleting == true} />
                    : null
                }
                <div className={threadClass} onClick={this.goToThread}>
                    {last ? null : <div className="thread-vertical-connection"></div>}
                    <div className="thread-first-image-wrapper">
                        <div className="thread-first-image-centered-wrapper">
                            <div className="thread-first-image">
                                <Image src={formattedThread.cached[0].image} defaultSrc={defaultUserImage} />
                            </div>
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
                                <div key={index} className="thread-image-wrapper"><div className="thread-image-centered-wrapper"><div className="thread-image"><Image src={item.image} defaultSrc={defaultUserImage} /></div></div></div> : '')}
                        </div>
                        {this.renderChipList(formattedThread.filters.userFilters, filters.userFilters)}
                    </div>
                </div>
                <OrientationRequiredPopup profile={profile} onContinue={this.continue}/>
            </div>

        );
    }

}

ThreadUsers.defaultProps = {
    strings: {
        people  : 'People',
        users   : 'Users',
        disabled: 'We are weaving this yarn, please wait a moment...'
    }
};