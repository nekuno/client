import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import CardContentList from '../components/interests/CardContentList';
import FilterContentButtonsList from '../components/ui/FilterContentButtonsList';
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
    return user ? user.id : null;
}

function requestData(props) {
    const {params} = props;
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']);
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
    const type = InterestStore.getType(otherUserId);
    const showOnlyCommon = InterestStore.getShowOnlyCommon(otherUserId);
    const requestComparedInterestsUrl = InterestStore.getRequestComparedInterestsUrl(otherUserId);

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingComparedInterests,
        otherUser,
        type,
        showOnlyCommon,
        requestComparedInterestsUrl
    };
}

@AuthenticatedComponent
@translate('OtherInterestsPage')
@popup('popup-report-content')
@connectToStores([UserStore, InterestStore], getState)
export default class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params                     : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user                       : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                    : PropTypes.object,
        // Injected by @connectToStores:
        pagination                 : PropTypes.object,
        totals                     : PropTypes.object,
        interests                  : PropTypes.array.isRequired,
        noInterests                : PropTypes.bool,
        isLoadingComparedInterests : PropTypes.bool,
        otherUser                  : PropTypes.object,
        type                       : PropTypes.string.isRequired,
        showOnlyCommon             : PropTypes.number.isRequired,
        requestComparedInterestsUrl: PropTypes.string,
        // Injected by @popup:
        showPopup                  : PropTypes.func,
        closePopup                 : PropTypes.func,
        popupContentRef            : PropTypes.func,
    };

    constructor(props) {

        super(props);

        this.onFilterCommonClick = this.onFilterCommonClick.bind(this);
        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.onContentClick = this.onContentClick.bind(this);
        this.onNavBarLeftLinkClick = this.onNavBarLeftLinkClick.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
        this.onReport = this.onReport.bind(this);
        this.onReportReasonText = this.onReportReasonText.bind(this);

        this.state = {
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

    componentDidUpdate(prevProps) {
        const {user, otherUser, showOnlyCommon, type} = this.props;
        const showOnlyCommonChanged = prevProps.showOnlyCommon !== showOnlyCommon;
        const otherUserChanged = parseId(prevProps.otherUser) !== parseId(otherUser);
        const typeChanged = prevProps.type !== type;
        if (showOnlyCommonChanged || otherUserChanged || typeChanged) {
            const otherUserId = parseId(otherUser);
            const userId = parseId(user);

            InterestsActionCreators.requestComparedInterests(userId, otherUserId, this.props.requestComparedInterestsUrl);
        }

        if (!this.state.carousel || this.props.interests.length === 0) {
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

        if (!this.state.carousel || this.props.interests.length === 0) {
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

    onBottomScroll() {
        const {user, otherUser, requestComparedInterestsUrl} = this.props;
        const userId = user ? parseId(user) : null;
        const otherUserId = otherUser ? parseId(otherUser) : null;
        if (userId && otherUserId && requestComparedInterestsUrl) {
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, requestComparedInterestsUrl);
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
            InterestsActionCreators.requestComparedInterests(parseId(_self.props.user), parseId(_self.props.otherUser), _self.props.requestComparedInterestsUrl);
        }
    }

    onFilterCommonClick(key) {
        const {showOnlyCommon, otherUser} = this.props;
        const otherUserId = parseId(otherUser);

        if (key !== showOnlyCommon) {
            InterestsActionCreators.setShowOnlyCommon(key, otherUserId);
            this.setState({
                carousel: false
            });
        }
    }

    onFilterTypeClick(pressedType) {
        const {type, otherUser} = this.props;
        const otherUserId = parseId(otherUser);

        if (type !== pressedType) {
            InterestsActionCreators.setType(pressedType, otherUserId);
        }
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
        const {strings, pagination, showOnlyCommon} = this.props;
        return <div className="title">{showOnlyCommon ? strings.similarInterestsCount.replace('%count%', pagination.total || 0) : strings.interestsCount.replace('%count%', pagination.total || 0)}</div>;
    }

    getFilterContentButtonsList() {
        const {otherUser, pagination, user, totals, isLoadingComparedInterests, showOnlyCommon, type} = this.props;
        const ownUserId = parseId(user);
        const otherUserId = otherUser ? parseId(otherUser) : null;

        return otherUser ? <FilterContentButtonsList userId={otherUserId} contentsCount={pagination.total || 0} ownContent={false} ownUserId={ownUserId} onClickHandler={this.onFilterTypeClick} commonContent={showOnlyCommon}
                                                     loading={isLoadingComparedInterests}
                                                     linksCount={totals.Link}
                                                     audiosCount={totals.Audio}
                                                     videosCount={totals.Video}
                                                     imagesCount={totals.Image}
                                                     channelsCount={totals.Creator}
                                                     type={type}
        /> : null;
    }

    getCommonContentSwitch() {
        const {strings, showOnlyCommon, isLoadingComparedInterests} = this.props;
        return <div className="common-content-switch">
            <TextRadios labels={[{key: 0, text: strings.all}, {key: 1, text: strings.common}]} value={showOnlyCommon} onClickHandler={this.onFilterCommonClick} disabled={isLoadingComparedInterests}/>
        </div>;
    }

    getFirstItems() {
        const profileAvatarsConnection = <div key="avatars-connection">{this.getProfileAvatarsConnection.bind(this)()}</div>;
        const title = <div key="title">{this.getTitle.bind(this)()}</div>;
        const filterButtons = <div key="filter-buttons">{this.getFilterContentButtonsList.bind(this)()}</div>;
        const commonContentSwitch = <div key="common-content-button">{this.getCommonContentSwitch.bind(this)()}</div>;

        return [
            profileAvatarsConnection,
            title,
            filterButtons,
            commonContentSwitch
        ]
    }

    render() {
        const {interests, noInterests, isLoadingComparedInterests, otherUser, user, params, strings} = this.props;
        const firstLoading = isLoadingComparedInterests && interests.length === 0;
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
                            {
                                /* Uncomment to enable carousel
                                 this.state.carousel ?
                                 <CardContentCarousel contents={interests} userId={ownUserId} otherUserId={otherUserId}/>
                                 :
                                 <CardContentList contents={interests} userId={ownUserId} otherUserId={otherUserId}
                                 onClickHandler={this.onContentClick}/>
                                 */
                            }

                            <CardContentList firstItems={this.getFirstItems.bind(this)()} contents={interests} userId={ownUserId} otherUserId={otherUserId}
                                             onBottomScroll={this.onBottomScroll.bind(this)} onReport={this.onReport.bind(this)} firstLoading={firstLoading} isLoading={isLoadingComparedInterests}/>

                            <br/>
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
}

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
        loading              : 'Loading interests',
        empty                : 'No interests to show with this filters',
        reported             : 'The content has been reported. We will review it within next 24 hours'
    }
};