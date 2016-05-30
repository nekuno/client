import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import LeftLinkRightSearchTopNavbar from '../components/ui/LeftLinkRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
import FilterContentPopup from '../components/ui/FilterContentPopup';
import TextRadios from '../components/ui/TextRadios';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import UserStore from '../stores/UserStore';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';

function parseId(user) {
    return user.qnoow_id;
}

function requestData(props) {
    const userId = parseId(props.user);
    UserActionCreators.requestUser(props.params.userId, ['username', 'email', 'picture', 'status']);
    InterestsActionCreators.requestComparedInterests(userId, props.params.userId, 'Link', 1);
}

function getState(props) {
    const otherUserId = props.params.userId;
    const pagination = InterestStore.getPagination(otherUserId) || {};
    const interests = InterestStore.get(otherUserId) || [];
    const otherUser = UserStore.get(otherUserId);
    return {
        pagination,
        interests,
        otherUser
    };
}

@AuthenticatedComponent
@translate('OtherInterestsPage')
@connectToStores([UserStore, InterestStore, InterestsByUserStore], getState)
export default class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params    : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        pagination: PropTypes.object,
        interests : PropTypes.array.isRequired,
        otherUser : PropTypes.object
    };

    constructor(props) {

        super(props);

        this.onSearchClick = this.onSearchClick.bind(this);
        this.onFilterCommonClick = this.onFilterCommonClick.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavbarLeftLinkClick = this.onNavbarLeftLinkClick.bind(this);
        this.initSwiper = this.initSwiper.bind(this);

        this.state = {
            type         : '',
            commonContent: 1,
            carousel     : false,
            position     : 0,
            swiper       : null
        }
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
            this.state.swiper = this.initSwiper();
            this.state.carousel = true;

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
        nekunoApp.popup('.popup-filter-other-contents');
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
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 110);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextComparedInterests(parseId(this.props.user), this.props.params.userId, nextLink);
        }
    }

    onNavbarLeftLinkClick() {
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
            InterestsActionCreators.requestNextComparedInterests(parseId(_self.props.user), _self.props.params.userId, nextLink);
        }
    }

    onFilterCommonClick(key) {
        InterestsActionCreators.resetInterests(this.props.params.userId);
        InterestsActionCreators.requestComparedInterests(parseId(this.props.user), parseInt(this.props.params.userId), this.state.type, key);
        this.setState({
            commonContent: key,
            carousel     : false
        });
    }

    onFilterTypeClick(type) {
        this.setState({
            type: type
        });
    }

    render() {
        const {interests, otherUser, user, params, pagination, strings} = this.props;
        const ownUserId = parseId(user);
        const otherUserId = parseInt(params.userId);
        const otherUserPicture = otherUser && otherUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${otherUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const ownPicture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                {this.state.carousel ?
                    <LeftLinkRightSearchTopNavbar leftText={strings.cancel} centerText={otherUser ? otherUser.username : ''} onLeftLinkClickHandler={this.onNavbarLeftLinkClick} onRightLinkClickHandler={this.onSearchClick}/>
                    :
                    <LeftMenuRightSearchTopNavbar centerText={otherUser ? otherUser.username : ''} onRightLinkClickHandler={this.onSearchClick}/>
                }
                <div className="page other-interests-page">
                    <div id="page-content" className="other-interests-content">
                        <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherUserPicture}/>
                        <div className="title">{this.state.commonContent ? strings.similarInterestsCount.replace('%count%', pagination.total || 0) : strings.interestsCount.replace('%count%', pagination.total || 0)}</div>
                        <div className="common-content-switch">
                            <TextRadios labels={[{key: 0, text: strings.all}, {key: 1, text: strings.common}]} value={this.state.commonContent} onClickHandler={this.onFilterCommonClick}/>
                        </div>
                        {this.state.carousel ?
                            <CardContentCarousel contents={interests} userId={otherUserId}/>
                            :
                            <CardContentList contents={interests} userId={otherUserId} onClickHandler={this.onContentClick}/>
                        }
                        <br />
                        {this.state.carousel ? '' : <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>}
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                {otherUser ? <div className="arrow-up" style={{ left: '80%' }}></div> : null}
                {otherUser ?
                    <ToolBar links={[
                    {'url': `/profile/${otherUserId}`, 'text': strings.about},
                    {'url': `/users/${otherUserId}/other-questions`, 'text': strings.questions},
                    {'url': `/users/${otherUserId}/other-interests`, 'text': strings.interests}
                    ]} activeLinkIndex={2}/>
                        : 
                    ''}
                {otherUser ?
                    <FilterContentPopup userId={otherUserId} contentsCount={pagination.total || 0} ownContent={false} ownUserId={ownUserId} onClickHandler={this.onFilterTypeClick} commonContent={this.state.commonContent}/>
                        :
                    ''}
            </div>
        );
    }

};

OtherInterestsPage.defaultProps = {
    strings: {
        cancel               : 'Cancel',
        interestsCount       : '%count% Interests',
        similarInterestsCount: '%count% Similar interests',
        all                  : 'All',
        common               : 'In common',
        about                : 'About',
        questions            : 'Answers',
        interests            : 'Interests'
    }
};