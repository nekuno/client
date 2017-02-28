import React, { PropTypes, Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
import FilterContentButtons from '../components/ui/FilterContentButtons';
import TextRadios from '../components/ui/TextRadios';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import UserStore from '../stores/UserStore';
import InterestStore from '../stores/InterestStore';

function parseId(user) {
    return user.id;
}

function requestData(props) {
    const {params} = props;
    const userId = parseId(props.user);
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']).then(
        () => {
            const otherUser = UserStore.getBySlug(params.slug);
            const otherUserId = parseId(otherUser);
            InterestsActionCreators.resetInterests(otherUserId);
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, 'Link', 1);
        },
        (status) => { console.log(status.error) }
    );
}

function getState(props) {
    const otherUserSlug = props.params.slug;
    const otherUser = UserStore.getBySlug(otherUserSlug);
    const otherUserId = otherUser ? parseId(otherUser) : null;
    const pagination = otherUserId ? InterestStore.getPagination(otherUserId) || {} : {};
    const totals = otherUserId ? InterestStore.getTotals(otherUserId) || {} : {};
    const interests = otherUserId ? InterestStore.get(otherUserId) || [] : [];
    const noInterests = otherUserId ? InterestStore.noInterests(otherUserId) || false : null;
    const isLoadingComparedInterests = InterestStore.isLoadingComparedInterests();
    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingComparedInterests,
        otherUser
    };
}

@AuthenticatedComponent
@translate('OtherInterestsPage')
@connectToStores([UserStore, InterestStore], getState)
export default class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params                    : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user                      : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                   : PropTypes.object,
        // Injected by @connectToStores:
        pagination                : PropTypes.object,
        totals                    : PropTypes.object,
        interests                 : PropTypes.array.isRequired,
        isLoadingComparedInterests: PropTypes.bool,
        otherUser                 : PropTypes.object
    };

    constructor(props) {

        super(props);

        this.onFilterCommonClick = this.onFilterCommonClick.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavBarLeftLinkClick = this.onNavBarLeftLinkClick.bind(this);
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
        requestData(this.props);
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.slug !== this.props.params.slug) {
            requestData(nextProps);
        }
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

    onContentClick(contentKey) {
        this.setState({
            carousel: true,
            position: contentKey,
            swiper  : null
        });
    };

    handleScroll() {
        const {pagination, isLoadingComparedInterests} = this.props;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 117);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax && !isLoadingComparedInterests) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextComparedInterests(parseId(this.props.user), parseId(this.props.otherUser), nextLink);
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
            InterestsActionCreators.requestNextComparedInterests(parseId(_self.props.user), parseId(_self.props.otherUser), nextLink);
        }
    }

    onFilterCommonClick(key) {
        InterestsActionCreators.resetInterests(parseId(this.props.otherUser));
        InterestsActionCreators.requestComparedInterests(parseId(this.props.user), parseId(this.props.otherUser), this.state.type, key);
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
        const {interests, noInterests, otherUser, user, params, pagination, totals, strings} = this.props;
        const ownUserId = parseId(user);
        const otherUserId = otherUser ? parseId(otherUser) : null;
        const otherUserPicture = otherUser && otherUser.photo ? otherUser.photo.thumbnail.small : 'img/no-img/small.jpg';
        const ownPicture = user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        return (
            <div className="views">
                {this.state.carousel ?
                    <TopNavBar leftText={strings.cancel} centerText={otherUser ? otherUser.username : ''} onLeftLinkClickHandler={this.onNavBarLeftLinkClick}/>
                    :
                    <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''}/>
                }
                {otherUser ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests}
                    ]} activeLinkIndex={2} arrowUpLeft={'83%'}/>
                    :
                    ''}
                <ScrollContainer scrollKey={"other-interests-" + params.slug}>
                    <div className="view view-main" onScroll={this.handleScroll}>
                        <div className="page other-interests-page">
                            <div id="page-content" className="other-interests-content">
                                <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherUserPicture}/>
                                <div className="title">{this.state.commonContent ? strings.similarInterestsCount.replace('%count%', pagination.total || 0) : strings.interestsCount.replace('%count%', pagination.total || 0)}</div>
                                {otherUser ? <FilterContentButtons userId={otherUserId} contentsCount={pagination.total || 0} ownContent={false} ownUserId={ownUserId} onClickHandler={this.onFilterTypeClick} commonContent={this.state.commonContent}
                                                      linksCount={totals.Link}
                                                      audiosCount={totals.Audio}
                                                      videosCount={totals.Video}
                                                      imagesCount={totals.Image}
                                                      channelsCount={totals.Creator}
                                /> : ''}
                                <div className="common-content-switch">
                                    <TextRadios labels={[{key: 0, text: strings.all}, {key: 1, text: strings.common}]} value={this.state.commonContent} onClickHandler={this.onFilterCommonClick}/>
                                </div>
                                {noInterests ? '' :
                                    /* Uncomment to enable carousel
                                    this.state.carousel ?
                                        <CardContentCarousel contents={interests} userId={ownUserId} otherUserId={otherUserId}/>
                                        :
                                        <CardContentList contents={interests} userId={ownUserId} otherUserId={otherUserId}
                                                         onClickHandler={this.onContentClick}/>
                                     */
                                    <CardContentList contents={interests} userId={ownUserId} otherUserId={otherUserId}/>
                                }
                                <br />
                                {this.state.carousel ? '' : <div className="loading-gif" style={pagination.nextLink ? {} : {display: 'none'}}></div>}
                            </div>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </ScrollContainer>
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
        photos               : 'Photos',
        questions            : 'Answers',
        interests            : 'Interests'
    }
};