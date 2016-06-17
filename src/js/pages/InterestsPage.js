import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import FilterContentPopup from '../components/ui/FilterContentPopup';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';

function parseId(user) {
    return user.qnoow_id;
}

function requestData(props) {
    const userId = parseId(props.user);
    InterestsActionCreators.requestOwnInterests(userId);
}

function getState(props) {
    const userId = parseId(props.user);
    const pagination = InterestStore.getPagination(userId) || {};
    const interests = InterestStore.get(userId) || [];
    return {
        pagination,
        interests
    };
}

@AuthenticatedComponent
@translate('InterestsPage')
@connectToStores([InterestStore, InterestsByUserStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        pagination: PropTypes.object,
        interests : PropTypes.array.isRequired
    };

    constructor(props) {

        super(props);

        this.onSearchClick = this.onSearchClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavBarLeftLinkClick = this.onNavBarLeftLinkClick.bind(this);
        this.initSwiper = this.initSwiper.bind(this);

        this.state = {
            carousel: false,
            position: 0,
            swiper  : null
        };
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate() {
        if (!this.state.carousel || this.props.interests.length == 0) {
            return;
        }
        if (!this.state.swiper) {
            this.state = {
                swiper  : this.initSwiper(),
                carousel: true
            };
        } else {
            this.state.swiper.updateSlidesSize();
        }
    }

    componentDidMount() {
        if (!this.state.carousel || this.props.interests.length == 0) {
            return;
        }
        this.state = {
            swiper  : this.initSwiper(),
            carousel: true
        };
    }

    onSearchClick() {
        nekunoApp.popup('.popup-filter-contents');
        this.setState({
            carousel: false,
            swiper  : null
        });
    };

    onContentClick(contentKey) {
        this.setState({
            carousel: true,
            position: contentKey,
            swiper  : null
        });
    };

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextOwnInterests(parseId(this.props.user), nextLink);
        }
    }

    onNavBarLeftLinkClick() {
        this.setState({
            carousel: false
        });
    }

    initSwiper() {
        var _self = this;
        return nekunoApp.swiper('.swiper-container', {
            onReachEnd    : onReachEnd,
            effect        : 'coverflow',
            slidesPerView : 'auto',
            coverflow     : {
                rotate      : 30,
                stretch     : 0,
                depth       : 100,
                modifier    : 1,
                slideShadows: false
            },
            centeredSlides: true,
            grabCursor    : true,
            initialSlide  : this.state.position
        });

        function onReachEnd() {
            let pagination = _self.props.pagination;
            let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
            InterestsActionCreators.requestNextOwnInterests(parseId(_self.props.user), nextLink);
        }
    }

    render() {

        const {pagination, interests, user, strings} = this.props;
        const isArrayEmpty = Array.isArray(interests) && interests.length === 0;

        return (
            <div className="view view-main" onScroll={this.state.carousel ? function() {} : this.handleScroll}>
                {this.state.carousel ?
                    <TopNavBar leftText={strings.cancel} centerText={strings.myProfile} rightIcon={'search'} onLeftLinkClickHandler={this.onNavBarLeftLinkClick} onRightLinkClickHandler={this.onSearchClick}/>
                    :
                    <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'search'} onRightLinkClickHandler={this.onSearchClick}/>
                }
                <div className="page interests-page">
                    <div id="page-content" className="interests-content">
                        {isArrayEmpty ?
                            <EmptyMessage text={strings.empty} />
                            :
                            this.state.carousel ?
                                <CardContentCarousel contents={interests} userId={parseId(user)}/>
                                :
                                <CardContentList contents={interests} userId={parseId(user)}
                                                 onClickHandler={this.onContentClick}/>
                        }
                        <br />
                        {this.state.carousel ? '' :
                            <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>}
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <ToolBar links={[
                {'url': '/profile', 'text': strings.about},
                {'url': '/gallery', 'text': strings.photos},
                {'url': '/questions', 'text': strings.questions},
                {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                <FilterContentPopup userId={parseId(user)} contentsCount={pagination.total || 0} ownContent={true}/>
            </div>
        );
    }

};

InterestsPage.defaultProps = {
    strings: {
        cancel   : 'Cancel',
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests',
        empty    : 'You have no interests yet. Please, connect more social media or explore your yarns and let us know what are you interested in.'
    }
};