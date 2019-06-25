import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import CardContentList from '../components/interests/CardContentList';
import FilterContentButtonsList from '../components/ui/FilterContentButtonsList';
import SocialNetworksBanner from '../components/socialNetworks/SocialNetworksBanner';
import ReportContentPopup from '../components/interests/ReportContentPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import InterestStore from '../stores/InterestStore';
import WorkersStore from '../stores/WorkersStore';
import Framework7Service from '../services/Framework7Service';

function parseId(user) {
    return user.id;
}

function getState(props) {
    const userId = parseId(props.user);
    const pagination = InterestStore.getPagination(userId) || {};
    const totals = InterestStore.getTotals(userId) || {};
    const interests = InterestStore.get(userId) || [];
    const noInterests = InterestStore.noInterests(userId) || false;
    const isLoadingOwnInterests = InterestStore.isLoadingOwnInterests();
    const type = InterestStore.getType(userId);
    const requestInterestsUrl = InterestStore.getRequestInterestsUrl(userId);
    const networks = WorkersStore.getAll();
    const isWorkersLoading = WorkersStore.isLoading();

    return {
        pagination,
        totals,
        interests,
        noInterests,
        isLoadingOwnInterests,
        networks,
        type,
        requestInterestsUrl,
        isWorkersLoading,
    };
}

@AuthenticatedComponent
@popup('popup-report-content')
@translate('InterestsPage')
@connectToStores([InterestStore, WorkersStore], getState)
export default class InterestsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                 : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @connectToStores:
        pagination           : PropTypes.object,
        totals               : PropTypes.object,
        interests            : PropTypes.array.isRequired,
        noInterests          : PropTypes.bool,
        isLoadingOwnInterests: PropTypes.bool,
        networks             : PropTypes.array.isRequired,
        type                 : PropTypes.string.isRequired,
        requestInterestsUrl  : PropTypes.string.isRequired,
        isWorkersLoading     : PropTypes.bool,
        // Injected by @popup:
        showPopup                  : PropTypes.func,
        closePopup                 : PropTypes.func,
        popupContentRef            : PropTypes.func,
    };

    constructor(props) {

        super(props);

        this.onFilterTypeClick = this.onFilterTypeClick.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.onReport = this.onReport.bind(this);
        this.onReportReasonText = this.onReportReasonText.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {user, requestInterestsUrl, type} = this.props;

        if (type !== prevProps.type) {
            InterestsActionCreators.requestOwnInterests(parseId(user), requestInterestsUrl);
        }
    }

    onBottomScroll() {
        const {requestInterestsUrl, user} = this.props;
        const userId = parseId(user);

        if (requestInterestsUrl) {
            InterestsActionCreators.requestOwnInterests(userId, requestInterestsUrl);
        }
    }

    getBanner(props) {
        const {networks, user, isWorkersLoading} = props;
        const connectedNetworks = networks.filter(network => network.connected);
        return connectedNetworks.length < 4 ? <SocialNetworksBanner key='socialNetworksBanner' networks={networks} user={user} isLoading={isWorkersLoading}/> : ''
    }

    getFilterButtons() {
        const {pagination, totals, user, isLoadingOwnInterests, type} = this.props;
        const userId = parseId(user);
        return <FilterContentButtonsList userId={userId} contentsCount={pagination.total || 0} ownContent={true} onClickHandler={this.onFilterTypeClick}
                                         linksCount={totals.Web}
                                         audiosCount={totals.Audio}
                                         videosCount={totals.Video}
                                         imagesCount={totals.Image}
                                         channelsCount={totals.Creator}
                                         gamesCount={totals.Game}
                                         facebookCount={totals.LinkFacebook}
                                         twitterCount={totals.LinkTwitter}
                                         youtubeCount={totals.LinkYoutube}
                                         spotifyCount={totals.LinkSpotify}
                                         tumblrCount={totals.LinkTumblr}
                                         steamCount={totals.LinkSteam}
                                         instagramCount={totals.LinkInstagram}
                                         loading={isLoadingOwnInterests}
                                         type={type}
        />
    }

    onFilterTypeClick(pressedType) {
        const {type} = this.props;

        if (type !== pressedType) {
            InterestsActionCreators.setType(pressedType);
        } else {
            InterestsActionCreators.removeType();
        }
    }

    onReport(contentId, reason) {
        const {requestInterestsUrl, user} = this.props;
        const userId = parseId(user);
        this.setState({
            reportContentId: contentId,
            reportReason   : reason
        });
        setTimeout(() => {
            this.props.showPopup();
            setTimeout(() => InterestsActionCreators.requestOwnInterests(userId, requestInterestsUrl), 0);
        }, 0);
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
            () => {
                Framework7Service.nekunoApp().alert(strings.reported);
            }, (error) => console.log(error)
        );
    }

    getFirstItems() {
        const {isLoadingOwnInterests, noInterests, type} = this.props;

        const banner = <div key="banner">{this.getBanner(this.props)}</div>;
        let firstItems = [banner];

        if (!noInterests || isLoadingOwnInterests || type !== '') {
            const filterButtons = <div key="filter-buttons">{this.getFilterButtons.bind(this)()}</div>;
            firstItems.push(filterButtons);
        }

        return firstItems;
    }

    render() {
        const {interests, user, strings, isLoadingOwnInterests} = this.props;
        const loadingFirst = isLoadingOwnInterests && interests.length === 0;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about, 'icon': 'account'},
                    {'url': '/gallery', 'text': strings.photos, 'icon': 'camera-outline'},
                    {'url': '/questions', 'text': strings.questions, 'icon': 'comment-question-outline'},
                    {'url': '/interests', 'text': strings.interests, 'icon': 'thumbs-up-down'},
                ]} activeLinkIndex={3} arrowUpLeft={'85%'}/>
                <div className="view view-main" id="interests-view-main">
                    <div className="page interests-page">
                        <div id="page-content" className="interests-content">
                            <CardContentList firstItems={this.getFirstItems.bind(this)()} contents={interests} userId={parseId(user)} onBottomScroll={this.onBottomScroll} loadingFirst={loadingFirst} isLoading={isLoadingOwnInterests} onReport={this.onReport}/>
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

InterestsPage.defaultProps = {
    strings         : {
        cancel   : 'Cancel',
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests',
        loading  : 'Loading interests',
        empty    : 'You have no interests yet. Please, connect more social media or explore your yarns and let us know what are you interested in.',
        reported : 'The content has been reported. We will review it within next 24 hours'
    },
    isWorkersLoading: false,
};