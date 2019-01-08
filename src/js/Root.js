import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Router, Route, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';

import App from './App';
import HomePage from './pages/HomePage';
import AnswerUsernamePage from './pages/AnswerUsernamePage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import ProfessionalProfileIndustryPage from './pages/ProfessionalProfileIndustryPage';
import ProfessionalProfileSkillsPage from './pages/ProfessionalProfileSkillsPage';
import LeisureProfilePage from './pages/LeisureProfilePage';
import LeisureProfileSportsPage from './pages/LeisureProfileSportsPage';
import LeisureProfileHobbiesPage from './pages/LeisureProfileHobbiesPage';
import LeisureProfileGamesPage from './pages/LeisureProfileGamesPage';
import ExplorerProfilePage from './pages/ExplorerProfilePage';
import ExplorerProfileCostPage from './pages/ExplorerProfileCostPage';
import ExplorerProfileEventsPage from './pages/ExplorerProfileEventsPage';
import ExplorerProfileRestaurantsPage from './pages/ExplorerProfileRestaurantsPage';
import ExplorerProfilePlansPage from './pages/ExplorerProfilePlansPage';
import AvailabilityPage from './pages/AvailabilityPage';
import AvailabilityEditOnSignUpPage from './pages/AvailabilityEditOnSignUpPage';
import AvailabilityEditPage from './pages/AvailabilityEditPage';
import ConnectFacebookPage from './pages/ConnectFacebookPage';
import ConnectingFacebookPage from './pages/ConnectingFacebookPage';
import ProposalsPage from './pages/ProposalsPage';
import PersonsPage from './pages/PersonsPage';
import PersonsAllPage from './pages/PersonsAllPage';
import PersonsFilterPage from './pages/PersonsFilterPage';
import OwnProposalsPage from './pages/OwnProposalsPage';
import ExplorePage from './pages/ExplorePage';
import ChatThreadsPage from './pages/ChatThreadsPage';
import ChatMessagesPage from './pages/ChatMessagesPage';
import InterestsPage from './pages/OtherUser/InterestsPage';
import GalleryPage from './pages/GalleryPage';
import OtherGalleryPage from './pages/OtherGalleryPage';
import GalleryPhotoPage from './pages/GalleryPhotoPage';
import OtherGalleryPhotoPage from './pages/OtherGalleryPhotoPage';
import GalleryProfilePhotoPage from './pages/GalleryProfilePhotoPage';
import GalleryAlbumsPage from './pages/GalleryAlbumsPage';
import GalleryAlbumPhotosPage from './pages/GalleryAlbumPhotosPage';
import OtherInterestsPage from './pages/OtherInterestsPage';
import QuestionsPage from './pages/QuestionsPage';
import OtherQuestionsPage from './pages/OtherQuestionsPage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import AnswerNextQuestionPage from './pages/AnswerNextQuestionPage';
import AnswerNextOtherQuestionPage from './pages/AnswerNextOtherQuestionPage';
import QuestionStatsPage from './pages/QuestionStatsPage';
import QuestionEditedStatsPage from './pages/QuestionEditedStatsPage';
import QuestionOtherStatsPage from './pages/QuestionOtherStatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterQuestionsLandingPage from './pages/RegisterQuestionLandingPage';
import AnswerUserFieldPage from './pages/AnswerUserFieldPage';
import AnswerProfileFieldPage from './pages/AnswerProfileFieldPage';
import UserPage from './pages/UserPage';
import OtherUserPage from './pages/OtherUserPage';
import SharedUserPage from './pages/SharedUserPage';
import ProfilePage from './pages/ProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import RecommendationPage from './pages/RecommendationPage';
import InvitationsPage from './pages/InvitationsPage';
import ConnectSocialNetworksOnSignUpPage from './pages/ConnectSocialNetworksOnSignUpPage';
import ConnectSocialNetworksPage from './pages/ConnectSocialNetworksPage';
import EditThreadLitePage from './pages/EditThreadLitePage';
import GroupPage from './pages/GroupPage';
import GroupStatsPage from './pages/GroupStatsPage';
import GroupMembersPage from './pages/GroupMembersPage';
import GroupContentsPage from './pages/GroupContentsPage';
import SettingsPage from './pages/SettingsPage';
import RouterActionCreators from './actions/RouterActionCreators';
import LoginStore from './stores/LoginStore';

import ProposalsProjectIntroductionPage from "./pages/Proposals/Project/IntroductionPage";
import ProposalsProjectBasicPage from "./pages/Proposals/Project/BasicPage";
import ProposalsProjectIndustryPage from "./pages/Proposals/Project/IndustryPage";
import ProposalsProjectProfessionPage from "./pages/Proposals/Project/ProfessionPage";
import ProposalsProjectAvailabilityPage from "./pages/Proposals/Project/AvailabilityPage";
import ProposalsProjectAvailabilityDatesPage from "./pages/Proposals/Project/AvailabilityDatesPage";
import ProposalsProjectFeaturesPage from "./pages/Proposals/Project/FeaturesPage";
import ProposalsProjectPreviewPage from "./pages/Proposals/Project/PreviewPage";

import ProposalsLeisureIntroductionPage      from "./pages/Proposals/Leisure/IntroductionPage";
import ProposalsLeisureBasicPage             from "./pages/Proposals/Leisure/BasicPage";
import ProposalsLeisureTypePage              from "./pages/Proposals/Leisure/TypePage";
import ProposalsLeisureAvailability          from "./pages/Proposals/Leisure/AvailabilityPage";
import ProposalsLeisureAvailabilityDatesPage from "./pages/Proposals/Leisure/AvailabilityDatesPage";
import ProposalsLeisureFeaturesPage          from "./pages/Proposals/Leisure/FeaturesPage";
import ProposalsLeisurePreviewPage           from "./pages/Proposals/Leisure/PreviewPage";

import ProposalsExperienceIntroductionPage      from "./pages/Proposals/Experience/IntroductionPage";
import ProposalsExperienceBasicPage             from "./pages/Proposals/Experience/BasicPage";
import ProposalsExperienceTypePage              from "./pages/Proposals/Experience/TypePage";
import ProposalsExperienceAvailability          from "./pages/Proposals/Experience/AvailabilityPage";
import ProposalsExperienceAvailabilityDatesPage from "./pages/Proposals/Experience/AvailabilityDatesPage";
import ProposalsExperienceFeaturesPage          from "./pages/Proposals/Experience/FeaturesPage";
import ProposalsExperiencePreviewPage           from "./pages/Proposals/Experience/PreviewPage";

import OtherUserProposalsPage from "./pages/OtherUser/ProposalsPage";
import AboutMePage from "./pages/OtherUser/AboutMePage";

function requireAuth(nextState, replaceState) {

    if (!LoginStore.isLoggedIn()) {
        let transitionPath = nextState.location.pathname;
        RouterActionCreators.storeRouterTransitionPath(transitionPath);
        console.log('Unauthorized path ', transitionPath, ' stored, redirecting to login now...');
        replaceState({nextPathname: nextState.location.pathname}, '/')
    }
}

export default class Root extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    };

    render() {
        const {history} = this.props;
        return (
            <Router history={history} render={applyRouterMiddleware(useScroll())}>
                <Route name="home" path="/" component={App}>

                    <Route name="splash" path="/splash" component={HomePage}/>
                    <Route name="answer-username" path="/answer-username" component={AnswerUsernamePage}/>
                    <Route name="professional-profile" path="/professional-profile" component={ProfessionalProfilePage}/>
                    <Route name="professional-profile-industry" path="/professional-profile-industry" component={ProfessionalProfileIndustryPage}/>
                    <Route name="professional-profile-skills" path="/professional-profile-skills" component={ProfessionalProfileSkillsPage}/>
                    <Route name="leisure-profile" path="/leisure-profile" component={LeisureProfilePage}/>
                    <Route name="leisure-profile-sports" path="/leisure-profile-sports" component={LeisureProfileSportsPage}/>
                    <Route name="leisure-profile-hobbies" path="/leisure-profile-hobbies" component={LeisureProfileHobbiesPage}/>
                    <Route name="leisure-profile-games" path="/leisure-profile-games" component={LeisureProfileGamesPage}/>
                    <Route name="explorer-profile" path="/explorer-profile" component={ExplorerProfilePage}/>
                    <Route name="explorer-profile-cost" path="/explorer-profile-cost" component={ExplorerProfileCostPage}/>
                    <Route name="explorer-profile-events" path="/explorer-profile-events" component={ExplorerProfileEventsPage}/>
                    <Route name="explorer-profile-restaurants" path="/explorer-profile-restaurants" component={ExplorerProfileRestaurantsPage}/>
                    <Route name="explorer-profile-plans" path="/explorer-profile-plans" component={ExplorerProfilePlansPage}/>
                    <Route name="availability" path="/availability" component={AvailabilityPage}/>
                    <Route name="availability-edit-on-sign-up" path="/availability-edit-on-sign-up" component={AvailabilityEditOnSignUpPage}/>
                    <Route name="connect-facebook" path="/connect-facebook" component={ConnectFacebookPage}/>
                    <Route name="login" path="/login" component={LoginPage}/>
                    <Route name="register" path="/register" component={RegisterPage}/>
                    <Route name="shared-user" path="/p/:slug" component={AboutMePage}/>
                    <Route name="shared-user-interests" path="/p/:slug/interests" component={InterestsPage}/>

                    <Route onEnter={requireAuth}>
                        <Route name="connecting-facebook" path="/connecting-facebook" component={ConnectingFacebookPage}/>
                        <Route name="proposals" path="/proposals" component={ProposalsPage}/>
                        <Route name="proposals-project-introduction" path="/proposals-project-introduction" component={ProposalsProjectIntroductionPage}/>
                        <Route name="proposals-project-basic" path="/proposals-project-basic" component={ProposalsProjectBasicPage}/>
                        <Route name="proposals-project-industry" path="/proposals-project-industry" component={ProposalsProjectIndustryPage}/>
                        <Route name="proposals-project-profession" path="/proposals-project-profession" component={ProposalsProjectProfessionPage}/>
                        <Route name="proposals-project-availability" path="/proposals-project-availability" component={ProposalsProjectAvailabilityPage}/>
                        <Route name="proposals-project-availability-dates" path="/proposals-project-availability-dates" component={ProposalsProjectAvailabilityDatesPage}/>
                        <Route name="proposals-project-features" path="/proposals-project-features" component={ProposalsProjectFeaturesPage}/>
                        <Route name="proposals-project-preview" path="/proposals-project-preview" component={ProposalsProjectPreviewPage}/>
                        <Route name="proposals-leisure-introduction" path="/proposals-leisure-introduction" component={ProposalsLeisureIntroductionPage}/>
                        <Route name="proposals-leisure-basic" path="/proposals-leisure-basic" component={ProposalsLeisureBasicPage}/>
                        <Route name="proposals-leisure-type" path="/proposals-leisure-type" component={ProposalsLeisureTypePage}/>
                        <Route name="proposals-leisure-availability" path="/proposals-leisure-availability" component={ProposalsLeisureAvailability}/>
                        <Route name="proposals-leisure-availability-dates" path="/proposals-leisure-availability-dates" component={ProposalsLeisureAvailabilityDatesPage}/>
                        <Route name="proposals-leisure-features" path="/proposals-leisure-features" component={ProposalsLeisureFeaturesPage}/>
                        <Route name="proposals-leisure-preview" path="/proposals-leisure-preview" component={ProposalsLeisurePreviewPage}/>
                        <Route name="proposals-experience-introduction" path="/proposals-experience-introduction" component={ProposalsExperienceIntroductionPage}/>
                        <Route name="proposals-experience-basic" path="/proposals-experience-basic" component={ProposalsExperienceBasicPage}/>
                        <Route name="proposals-experience-type" path="/proposals-experience-type" component={ProposalsExperienceTypePage}/>
                        <Route name="proposals-experience-availability" path="/proposals-experience-availability" component={ProposalsExperienceAvailability}/>
                        <Route name="proposals-experience-availability-dates" path="/proposals-experience-availability-dates" component={ProposalsExperienceAvailabilityDatesPage}/>
                        <Route name="proposals-experience-features" path="/proposals-experience-features" component={ProposalsExperienceFeaturesPage}/>
                        <Route name="proposals-experience-preview" path="/proposals-experience-preview" component={ProposalsExperiencePreviewPage}/>
                        <Route name="other-user-proposals" path="/p/:slug/proposals" component={OtherUserProposalsPage}/>
                        <Route name="persons" path="/persons" component={PersonsPage}/>
                        <Route name="persons-all" path="/persons-all" component={PersonsAllPage}/>
                        <Route name="persons-filter" path="/persons-filter/:threadId" component={PersonsFilterPage}/>
                        <Route name="plans" path="/plans" component={OwnProposalsPage}/>
                        <Route name="availability-edit" path="/availability-edit" component={AvailabilityEditPage}/>
                        <Route name="explore" path="/explore" component={ExplorePage}/>
                        <Route name="register-questions-landing" path="/register-questions-landing" component={RegisterQuestionsLandingPage}/>
                        <Route name="answer-user-fields" path="/answer-user-fields" component={AnswerUserFieldPage}/>
                        <Route name="answer-profile-fields" path="/answer-profile-fields" component={AnswerProfileFieldPage}/>
                        <Route name="notifications" path="/conversations" component={ChatThreadsPage}/>
                        <Route name="messages" path="/conversations/:slug" component={ChatMessagesPage}/>
                        {/*<Route name="interests" path="/interests" component={InterestsPage}/>*/}
                        {/*<Route name="other-interests" path="/users/:slug/other-interests" component={OtherInterestsPage}/>*/}
                        <Route name="gallery" path="/gallery" component={GalleryPage}/>
                        <Route name="other-gallery" path="/users/:slug/other-gallery/:photoId" component={OtherGalleryPage}/>
                        <Route name="gallery-photo" path="/gallery-photo" component={GalleryPhotoPage}/>
                        <Route name="other-gallery-photo" path="/users/:userId/other-gallery-photo" component={OtherGalleryPhotoPage}/>
                        <Route name="gallery-profile-photo" path="/gallery-profile-photo" component={GalleryProfilePhotoPage}/>
                        <Route name="gallery-albums" path="/gallery-albums" component={GalleryAlbumsPage}/>
                        <Route name="gallery-album-photos" path="/gallery-album-photos" component={GalleryAlbumPhotosPage}/>
                        <Route name="questions" path="/questions" component={QuestionsPage}/>
                        <Route name="other-questions" path="/users/:slug/other-questions" component={OtherQuestionsPage}/>
                        <Route name="answer-question" path="/answer-question/:questionId/:from" component={AnswerQuestionPage}/>
                        <Route name="answer-question-next" path="/answer-question/next" component={AnswerNextQuestionPage}/>
                        <Route name="answer-other-question-next" path="/answer-other-question/:slug/next" component={AnswerNextOtherQuestionPage}/>
                        <Route name="question-stats" path="/question-stats" component={QuestionStatsPage}/>
                        <Route name="question-stats-from" path="/question-stats/:from" component={QuestionEditedStatsPage}/>
                        <Route name="question-stats-other" path="/question-other-stats/:slug" component={QuestionOtherStatsPage}/>
                        <Route name="invitations" path="/invitations" component={InvitationsPage}/>
                        <Route name="discover" path="/discover" component={DiscoverPage}/>
                        <Route name="recommendations" path="/recommendations/:threadId" component={RecommendationPage}/>
                        <Route name="social-networks-on-sign-up" path="/social-networks-on-sign-up" component={ConnectSocialNetworksOnSignUpPage}/>
                        <Route name="social-networks" path="/social-networks" component={ConnectSocialNetworksPage}/>
                        <Route name="edit-thread" path="/edit-thread/:threadId" component={EditThreadLitePage}/>
                        <Route name="groups" path="/badges" component={GroupPage}/>
                        <Route name="group-discover" path="/badges/:groupId/discover" component={DiscoverPage}/>
                        {/*<Route name="group-stats" path="/badges/:groupId" component={GroupStatsPage}/>
                        <Route name="group-members" path="/badges/:groupId/members" component={GroupMembersPage}/>
                        <Route name="group-contents" path="/badges/:groupId/contents" component={GroupContentsPage}/>*/}
                        <Route name="settings" path="/settings" component={SettingsPage}/>
                    </Route>
                </Route>
            </Router>
        );
    }
}
