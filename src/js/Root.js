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
import ProposalsPage from './pages/Proposals/Recommendation/ProposalsPage';
import PersonsPage from './pages/PersonsPage';
import PersonsAllPage from './pages/PersonsAllPage';
import PersonsFilterPage from './pages/PersonsFilterPage';
import OwnProposalsPage from './pages/OwnProposalsPage';
import ExplorePage from './pages/ExplorePage';
import ChatThreadsPage from './pages/ChatThreadsPage';
import ChatMessagesPage from './pages/ChatMessagesPage';
import OwnUserInterestsPage from './pages/OwnUser/InterestsPage';
import GalleryPage from './pages/GalleryPage';
import OtherGalleryPage from './pages/OtherGalleryPage';
import GalleryPhotoPage from './pages/GalleryPhotoPage';
import OtherGalleryPhotoPage from './pages/OtherGalleryPhotoPage';
import GalleryProfilePhotoPage from './pages/GalleryProfilePhotoPage';
import GalleryAlbumsPage from './pages/GalleryAlbumsPage';
import GalleryAlbumPhotosPage from './pages/GalleryAlbumPhotosPage';
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
import ProfilePage from './pages/ProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import RecommendationPage from './pages/RecommendationPage';
import InvitationsPage from './pages/InvitationsPage';
import ConnectSocialNetworksOnSignUpPage from './pages/ConnectSocialNetworksOnSignUpPage';
import ConnectSocialNetworksPage from './pages/ConnectSocialNetworksPage';
import EditThreadLitePage from './pages/EditThreadLitePage';
import GroupPage from './pages/GroupPage';
import SettingsPage from './pages/SettingsPage';
import RouterActionCreators from './actions/RouterActionCreators';
import LoginStore from './stores/LoginStore';

import ProposalsProjectIntroductionPage from "./pages/Proposals/Project/IntroductionPage";
import ProposalsLeisureIntroductionPage      from "./pages/Proposals/Leisure/IntroductionPage";
import ProposalsExperienceIntroductionPage      from "./pages/Proposals/Experience/IntroductionPage";
import ProposalBasicEditPage from "./pages/Proposals/Edit/BasicPage";
import ProposalTypeEditPage from "./pages/Proposals/Edit/TypePage";
import ProposalProfessionEditPage from "./pages/Proposals/Edit/ProfessionPage";
import ProposalAvailabilityEditPage from "./pages/Proposals/Edit/AvailabilityPage";
import ProposalAvailabilityDatesEditPage from "./pages/Proposals/Edit/AvailabilityDatesPage";
import ProposalFeaturesPage from "./pages/Proposals/Edit/FeaturesPage";
import ProposalPreviewPage from "./pages/Proposals/Edit/PreviewPage";

import OtherUserProposalsPage from "./pages/OtherUser/ProposalsPage";
import OtherUserAboutMePage from "./pages/OtherUser/AboutMePage";
import OtherUserAnswersPage from "./pages/OtherUser/AnswersPage";
import OtherUserProposalDetailPage from "./pages/OtherUserProposalDetailPage";
import OtherUserInterestsPage from './pages/OtherUser/InterestsPage';

import ProposalDetailPage from "./pages/ProposalDetailPage";
import ProposalDetailMatchesPage from "./pages/ProposalDetailMatchesPage";
import OwnUserAboutMePage from "./pages/OwnUser/AboutMePage";
import OwnUserAnswersPage from "./pages/OwnUser/AnswersPage";
import FriendsPage from "./pages/OwnUser/FriendsPage";
import NetworksPage from "./pages/OwnUser/NetworksPage";
import EditProfilePage from "./pages/OwnUser/EditProfilePage";


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


                    <Route onEnter={requireAuth}>
                        <Route name="connecting-facebook" path="/connecting-facebook" component={ConnectingFacebookPage}/>
                        <Route name="proposals" path="/proposals" component={ProposalsPage}/>
                        <Route name="proposals-project-introduction" path="/proposals-project-introduction" component={ProposalsProjectIntroductionPage}/>
                        <Route name="proposals-leisure-introduction" path="/proposals-leisure-introduction" component={ProposalsLeisureIntroductionPage}/>
                        <Route name="proposals-experience-introduction" path="/proposals-experience-introduction" component={ProposalsExperienceIntroductionPage}/>
                        <Route name="proposal-basic-edit" path="/proposal-basic-edit/:proposalId" component={ProposalBasicEditPage}/>
                        <Route name="proposal-basic-create" path="/proposal-basic-edit" component={ProposalBasicEditPage}/>
                        <Route name="proposal-type-edit" path="/proposal-type-edit/:proposalId" component={ProposalTypeEditPage}/>
                        <Route name="proposal-type-create" path="/proposal-type-edit" component={ProposalTypeEditPage}/>
                        <Route name="proposal-profession-edit" path="/proposal-profession-edit/:proposalId" component={ProposalProfessionEditPage}/>
                        <Route name="proposal-profession-create" path="/proposal-profession-edit" component={ProposalProfessionEditPage}/>
                        <Route name="proposal-availability-edit" path="/proposal-availability-edit/:proposalId" component={ProposalAvailabilityEditPage}/>
                        <Route name="proposal-availability-create" path="/proposal-availability-edit" component={ProposalAvailabilityEditPage}/>
                        <Route name="proposal-availability-dates-edit" path="/proposal-availability-dates-edit/:proposalId" component={ProposalAvailabilityDatesEditPage}/>
                        <Route name="proposal-availability-dates-create" path="/proposal-availability-dates-edit" component={ProposalAvailabilityDatesEditPage}/>
                        <Route name="proposal-features-edit" path="/proposal-features-edit/:proposalId" component={ProposalFeaturesPage}/>
                        <Route name="proposal-features-create" path="/proposal-features-edit" component={ProposalFeaturesPage}/>
                        <Route name="proposal-preview-edit" path="/proposal-preview/:proposalId" component={ProposalPreviewPage}/>
                        <Route name="proposal-preview-create" path="/proposal-preview" component={ProposalPreviewPage}/>
                        <Route name="other-user-proposals" path="/p/:slug/proposals" component={OtherUserProposalsPage}/>
                        <Route name="other-user-answers" path="/p/:slug/answers" component={OtherUserAnswersPage}/>
                        <Route name="other-user-interests" path="/p/:slug/interests" component={OtherUserInterestsPage}/>
                        <Route name="other-user-proposal-detail" path="/p/:slug/proposal/:proposalId" component={OtherUserProposalDetailPage}/>
                        <Route name="profile" path="/p/:slug" component={ProfilePage}/>
                        <Route name="own-profile-edit" path="/p/:slug/edit" component={EditProfilePage}/>
                        <Route name="persons" path="/persons" component={PersonsPage}/>
                        <Route name="persons-all" path="/persons-all" component={PersonsAllPage}/>
                        <Route name="persons-filter" path="/persons-filter/:threadId" component={PersonsFilterPage}/>
                        <Route name="friends" path="/friends" component={FriendsPage}/>
                        <Route name="networks" path="/networks" component={NetworksPage}/>
                        <Route name="plans" path="/plans" component={OwnProposalsPage}/>
                        <Route name="proposal-detail" path="/proposal/:proposalId" component={ProposalDetailPage}/>
                        <Route name="proposal-detail-matches" path="/proposal/:proposalId/matches" component={ProposalDetailMatchesPage}/>
                        {/*<Route name="about-me" path="/about-me" component={OwnUserAboutMePage}/>*/}
                        <Route name="answers" path="/answers" component={OwnUserAnswersPage}/>
                        <Route name="availability-edit" path="/availability-edit" component={AvailabilityEditPage}/>
                        {/*<Route name="explore" path="/explore" component={ExplorePage}/>*/}
                        {/*<Route name="register-questions-landing" path="/register-questions-landing" component={RegisterQuestionsLandingPage}/>*/}
                        {/*<Route name="answer-user-fields" path="/answer-user-fields" component={AnswerUserFieldPage}/>*/}
                        {/*<Route name="answer-profile-fields" path="/answer-profile-fields" component={AnswerProfileFieldPage}/>*/}
                        <Route name="notifications" path="/conversations" component={ChatThreadsPage}/>
                        <Route name="messages" path="/p/:slug/conversations" component={ChatMessagesPage}/>
                        <Route name="interests" path="/interests" component={OwnUserInterestsPage}/>
                        {/*<Route name="other-interests" path="/users/:slug/other-interests" component={OtherInterestsPage}/>*/}
                        {/*<Route name="gallery" path="/gallery" component={GalleryPage}/>*/}
                        {/*<Route name="other-gallery" path="/users/:slug/other-gallery/:photoId" component={OtherGalleryPage}/>*/}
                        {/*<Route name="gallery-photo" path="/gallery-photo" component={GalleryPhotoPage}/>*/}
                        {/*<Route name="other-gallery-photo" path="/users/:userId/other-gallery-photo" component={OtherGalleryPhotoPage}/>*/}
                        {/*<Route name="gallery-profile-photo" path="/gallery-profile-photo" component={GalleryProfilePhotoPage}/>*/}
                        {/*<Route name="gallery-albums" path="/gallery-albums" component={GalleryAlbumsPage}/>*/}
                        {/*<Route name="gallery-album-photos" path="/gallery-album-photos" component={GalleryAlbumPhotosPage}/>*/}
                        {/*<Route name="questions" path="/questions" component={QuestionsPage}/>*/}
                        {/*<Route name="other-questions" path="/users/:slug/other-questions" component={OtherQuestionsPage}/>*/}
                        <Route name="answer-question" path="/answer-question/:questionId/:from" component={AnswerQuestionPage}/>
                        <Route name="answer-question-next" path="/answer-question/next" component={AnswerNextQuestionPage}/>
                        <Route name="answer-other-question-next" path="/answer-other-question/:slug/next" component={AnswerNextOtherQuestionPage}/>
                        {/*<Route name="question-stats" path="/question-stats" component={QuestionStatsPage}/>*/}
                        <Route name="question-stats-from" path="/question-stats/:from" component={QuestionEditedStatsPage}/>
                        {/*<Route name="question-stats-other" path="/question-other-stats/:slug" component={QuestionOtherStatsPage}/>*/}
                        {/*<Route name="invitations" path="/invitations" component={InvitationsPage}/>*/}
                        {/*<Route name="discover" path="/discover" component={DiscoverPage}/>*/}
                        {/*<Route name="recommendations" path="/recommendations/:threadId" component={RecommendationPage}/>*/}
                        {/*<Route name="social-networks-on-sign-up" path="/social-networks-on-sign-up" component={ConnectSocialNetworksOnSignUpPage}/>*/}
                        {/*<Route name="social-networks" path="/social-networks" component={ConnectSocialNetworksPage}/>*/}
                        {/*<Route name="edit-thread" path="/edit-thread/:threadId" component={EditThreadLitePage}/>*/}
                        {/*<Route name="groups" path="/badges" component={GroupPage}/>*/}
                        {/*<Route name="group-discover" path="/badges/:groupId/discover" component={DiscoverPage}/>*/}
                        {/*<Route name="group-stats" path="/badges/:groupId" component={GroupStatsPage}/>
                        <Route name="group-members" path="/badges/:groupId/members" component={GroupMembersPage}/>
                        <Route name="group-contents" path="/badges/:groupId/contents" component={GroupContentsPage}/>*/}
                        {/*<Route name="settings" path="/settings" component={SettingsPage}/>*/}
                    </Route>
                </Route>
            </Router>
        );
    }
}
