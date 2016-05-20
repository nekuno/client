import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import selectn from 'selectn'
import ChipList from './../ui/ChipList';
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
        filters: PropTypes.object.isRequired,
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

        let images = thread.cached.map((item, index) => item.picture ?
            `${IMAGES_ROOT}media/cache/resolve/profile_picture/user/images/${item.picture}` :
            `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`
        );

        thread.cached[0] = thread.cached[0] ? thread.cached[0] : [];
        images[0] = thread.cached[0].picture ?
            `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${thread.cached[0].picture}` :
            `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        images.forEach((item, index) => {
            if (thread.cached[index]) {
                thread.cached[index].image = item
            }
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
        if (selectn('orientation', this.props.profile) === undefined) {
            console.log('orientation required');
            nekunoApp.popup('.popup-orientation-required');
            document.getElementsByClassName('view')[0].scrollTop = 0;
        } else {
            this.continue();
        }
    }

    continue() {
        this.context.history.pushState(null, `users/${this.props.userId}/recommendations/${this.props.thread.id}`)
    }

    render() {
        const {thread, last, filters, profile, strings} = this.props;
        let formattedThread = this.mergeImagesWithThread(thread);
        return (
            <div>
                <div className="thread-listed" onClick={this.goToThread}>
                    {last ? <div className="threads-opposite-vertical-connection"></div> : ''}
                    <div className="thread-first-image">
                        <img src={formattedThread.cached[0].image}/>
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
                            {formattedThread.cached.map((item, index) => index !== 0 && item.image ?
                                <div key={index} className="thread-image"><img src={item.image}/></div> : '')}
                        </div>
                        {this.renderChipList(formattedThread.filters.userFilters, filters.userFilters)}
                    </div>
                </div>
                <OrientationRequiredPopup profile={profile} onContinue={this.continue}></OrientationRequiredPopup>
            </div>

        );
    }

}

ThreadUsers.defaultProps = {
    strings: {
        people: 'People',
        users : 'Users'
    }
};