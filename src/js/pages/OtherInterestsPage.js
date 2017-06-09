import React, { PropTypes, Component } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import CardContentList from '../components/interests/CardContentList';
import CardContentCarousel from '../components/interests/CardContentCarousel';
import FilterContentButtons from '../components/ui/FilterContentButtons';
import TextRadios from '../components/ui/TextRadios';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import ReportContentPopup from '../components/interests/ReportContentPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
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
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, 'Link', 1);
            InterestsActionCreators.resetInterests(otherUserId);
        },
        (status) => {
            console.log(status.error)
        }
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
@popup('popup-report-content')
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
        otherUser                 : PropTypes.object,
        // Injected by @popup:
        showPopup                 : PropTypes.func,
        closePopup                : PropTypes.func,
        popupContentRef           : PropTypes.func,
    };

    constructor(props) {

        super(props);

        this.onFilterCommonClick = this.onFilterCommonClick.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavBarLeftLinkClick = this.onNavBarLeftLinkClick.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
        this.onReport = this.onReport.bind(this);
        this.onReportReasonText = this.onReportReasonText.bind(this);

        this.state = {
            type           : '',
            commonContent  : 1,
            carousel       : false,
            position       : 0,
            swiper         : null,
            reportContentId: null,
            reportReason   : null,
        }
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillUnmount() {
        // document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
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
        // this.state = {
        //     swiper  : this.initSwiper(),
        //     carousel: true
        // };
    }

    onContentClick(contentKey) {
        this.setState({
            carousel: true,
            position: contentKey,
            swiper  : null
        });
    };

    handleScroll() {
        // const {pagination, isLoadingComparedInterests} = this.props;
        // let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        // let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 117);
        // let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);
        //
        // if (nextLink && offsetTop >= offsetTopMax && !isLoadingComparedInterests) {
        //     document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
        //     InterestsActionCreators.requestNextComparedInterests(parseId(this.props.user), parseId(this.props.otherUser), nextLink);
        // }
    }

    onBottomScroll() {
        const {pagination, user, otherUser} = this.props;
        const nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        const userId = user ? parseId(user) : null;
        const otherUserId = otherUser ? parseId(otherUser) : null;

        return InterestsActionCreators.requestNextComparedInterests(userId, otherUserId, nextLink);
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

    onReport(contentId, reason) {
        this.setState({
            reportContentId: contentId,
            reportReason   : reason
        });
        setTimeout(() => this.props.showPopup(), 0);
    }

    onReportReasonText(reasonText) {
        const {reportContentId, reportReason} = this.state;
        const {strings} = this.props;
        const data = {
            contentId : reportContentId,
            reason    : reportReason,
            reasonText: reasonText
        };
        this.props.closePopup();
        UserActionCreators.reportContent(data).then(
            () => nekunoApp.alert(strings.reported),
            (error) => console.log(error),
        );
    }

    getProfileAvatarsConnection() {
        const {user, otherUser} = this.props;

        const otherUserPicture = otherUser && otherUser.photo ? otherUser.photo.thumbnail.small : 'img/no-img/small.jpg';
        const ownPicture = user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';

        return <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherUserPicture}/>
    }

    getTitle() {
        const {strings, pagination} = this.props;
        return <div className="title">{this.state.commonContent ? strings.similarInterestsCount.replace('%count%', pagination.total || 0) : strings.interestsCount.replace('%count%', pagination.total || 0)}</div>;
    }

    getFilterContentButtons() {
        const {otherUser, pagination, user, totals} = this.props;
        const ownUserId = parseId(user);
        const otherUserId = otherUser ? parseId(otherUser) : null;

        return otherUser ? <FilterContentButtons userId={otherUserId} contentsCount={pagination.total || 0} ownContent={false} ownUserId={ownUserId} onClickHandler={this.onFilterTypeClick} commonContent={this.state.commonContent}
                                                 linksCount={totals.Link}
                                                 audiosCount={totals.Audio}
                                                 videosCount={totals.Video}
                                                 imagesCount={totals.Image}
                                                 channelsCount={totals.Creator}
            /> : '';
    }

    getCommonContentSwitch() {
        const strings = this.props.strings;
        return <div className="common-content-switch">
            <TextRadios labels={[{key: 0, text: strings.all}, {key: 1, text: strings.common}]} value={this.state.commonContent} onClickHandler={this.onFilterCommonClick}/>
        </div>;
    }

    getFirstItems() {
        const profileAvatarsConnection = this.getProfileAvatarsConnection.bind(this)();
        const title = this.getTitle.bind(this)();
        const filterButtons = this.getFilterContentButtons.bind(this)();
        const commonContentSwitch = this.getCommonContentSwitch.bind(this)();

        return [
            profileAvatarsConnection,
            title,
            filterButtons,
            commonContentSwitch
        ]
    }

    render() {
        const {interests, noInterests, otherUser, user, params, strings} = this.props;
        const ownUserId = parseId(user);
        const otherUserId = otherUser ? parseId(otherUser) : null;

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
                <div className="view view-main" id="interests-view-main">
                    <div className="page other-interests-page">
                        <div id="page-content" className="other-interests-content">
                            {noInterests && false ? '' :
                                /* Uncomment to enable carousel
                                 this.state.carousel ?
                                 <CardContentCarousel contents={interests} userId={ownUserId} otherUserId={otherUserId}/>
                                 :
                                 <CardContentList contents={interests} userId={ownUserId} otherUserId={otherUserId}
                                 onClickHandler={this.onContentClick}/>
                                 */
                                <CardContentList firstItems={this.getFirstItems.bind(this)()} contents={interests} userId={ownUserId} otherUserId={otherUserId} onBottomScroll={this.onBottomScroll.bind(this)}/>
                            }
                            <br />
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
                <ReportContentPopup onClick={this.onReportReasonText} contentRef={this.props.popupContentRef}/>
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
        interests            : 'Interests',
        reported             : 'The content has been reported. We will review it within next 24 hours'
    }
};