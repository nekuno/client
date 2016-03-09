import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import LeftLinkRightSearchTopNavbar from '../components/ui/LeftLinkRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
import FilterContentPopup from '../components/ui/FilterContentPopup';
import TextRadios from '../components/ui/TextRadios';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';


function parseId(user) {
    return user.qnoow_id;
}

function requestData(props) {
    const { user } = props;
    const userId = parseId(user);
    UserActionCreators.requestUser(props.params.userId, ['username', 'email', 'picture', 'status']);
    InterestsActionCreators.requestComparedInterests(userId, props.params.userId);
}

function getState(props) {
    const otherUserId = props.params.userId;
    const otherUser = UserStore.get(otherUserId);
    const interests = InterestStore.get(otherUserId) || [];
    const pagination = InterestStore.getPagination(otherUserId) || {};
    return {
        pagination,
        interests,
        otherUser
    };
}

@connectToStores([UserStore, InterestStore, InterestsByUserStore], getState)
export default AuthenticatedComponent(class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,

        user: PropTypes.object.isRequired,
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
            type: '',
            commonContent: 0,
            carousel: false,
            position: 0,
            swiper: null
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
            swiper: this.initSwiper(),
            carousel: true
        };
    }

    render() {
        const interests = this.props.interests;
        const otherUser = this.props.otherUser;
        const ownUser = this.props.user;
        const ownUserId = this.props.user.qnoow_id;
        const otherUserId = parseInt(this.props.params.userId);
        const otherUserPicture = otherUser && otherUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${otherUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const ownPicture = ownUser && ownUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${ownUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                {this.state.carousel ?
                    <LeftLinkRightSearchTopNavbar leftText={"Cancelar"} centerText={otherUser ? otherUser.username : ''} onLeftLinkClickHandler={this.onNavbarLeftLinkClick}
                                                  onRightLinkClickHandler={this.onSearchClick}/>
                    :
                    <LeftMenuRightSearchTopNavbar centerText={otherUser ? otherUser.username : ''}
                                                  onRightLinkClickHandler={this.onSearchClick}/>
                }
                <div data-page="index" className="page other-interests-page">
                    <div id="page-content" className="other-interests-content">
                        <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherUserPicture} />
                        <div className="title">{this.props.pagination.total} Intereses {this.state.commonContent ? 'similares' : ''}</div>
                        <div className="common-content-switch">
                            <TextRadios labels={[{key: 0, text: 'Todo'}, {key: 1, text: 'En común'}]} value={this.state.commonContent} onClickHandler={this.onFilterCommonClick}/>
                        </div>
                        {this.state.carousel ?
                            <CardContentCarousel contents={interests} userId={otherUserId} />
                            :
                            <CardContentList contents={interests} userId={otherUserId} onClickHandler={this.onContentClick}/>
                        }
                        <br />
                        {this.state.carousel ? '' : <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>}
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <ToolBar links={[
                {'url': `/profile/${otherUserId}`, 'text': 'Acerca de'},
                {'url': `/users/${otherUserId}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${otherUserId}/other-interests`, 'text': 'Intereses'}
                ]} activeLinkIndex={2}/>
                <FilterContentPopup userId={otherUserId} contentsCount={this.props.pagination.total || 0} ownContent={false} ownUserId={ownUserId} onClickHandler={this.onFilterTypeClick} commonContent={this.state.commonContent}/>
            </div>
        );
    }

    onSearchClick = function () {
        nekunoApp.popup('.popup-filter-other-contents');
        this.setState({
            carousel: false,
            swiper: null
        });
    };

    onContentClick(contentKey) {
        this.setState({
            carousel: true,
            position: contentKey,
            swiper: null
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
            onReachEnd: onReachEnd,
            effect: 'coverflow',
            slidesPerView: 'auto',
            coverflow: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : false
            },
            centeredSlides: true,
            grabCursor: true,
            initialSlide: this.state.position
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
            carousel: false
        });
    }

    onFilterTypeClick(type) {
        this.setState({
            type: type
        });
    }
});