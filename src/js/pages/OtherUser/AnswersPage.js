import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import '../../../scss/pages/other-user/answers.scss';
import SelectCollapsible from "../../components/ui/SelectCollapsible/SelectCollapsible";
import {action} from "@storybook/addon-actions";
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import UserStore from "../../stores/UserStore";
import * as UserActionCreators from "../../actions/UserActionCreators";
import OtherUserBottomNavBar from "../../components/ui/OtherUserBottomNavBar/OtherUserBottomNavBar";
import styles from "../../components/Proposal/OwnProposalCard/OwnProposalCard.scss";
import RoundedImage from "../../components/ui/RoundedImage/RoundedImage";
import AnswerQuestionCard from "../../components/ui/AnswerQuestionCard/AnswerQuestionCard";
import QuestionStore from "../../stores/QuestionStore";
import * as QuestionActionCreators from "../../actions/QuestionActionCreators";
import * as ProposalActionCreators from "../../actions/ProposalActionCreators";
import QuestionMatch from "../../components/ui/QuestionMatch/QuestionMatch";
import QuestionPartialMatch from "../../components/ui/QuestionPartialMatch/QuestionPartialMatch";
import Scroll from "../../components/Scroll/Scroll";
import Question from "../../components/questions/Question";
import EmptyMessage from "../../components/ui/EmptyMessage";
import QuestionNotMatch from "../../components/ui/QuestionNotMatch/QuestionNotMatch";


/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    QuestionActionCreators.requestQuestionsBySlug(props.params.slug);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {params} = props;
    const otherUser = UserStore.getBySlug(params.slug);
    const otherUserQuestions = otherUser ? QuestionStore.get(otherUser.id) : null;
    const userQuestions = props.user ? QuestionStore.get(props.user.id) : null;
    const otherNotAnsweredQuestions = otherUser ? QuestionStore.getOtherNotAnsweredQuestions(otherUser.id) : null;

    const requestQuestionsUrl = otherUser ? QuestionStore.getRequestComparedQuestionsUrl(otherUser.id, []) : null;
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();


    console.log(requestQuestionsUrl);

    return {
        otherUser,
        otherUserQuestions,
        userQuestions,
        otherNotAnsweredQuestions,
        isLoadingOwnQuestions,
        requestQuestionsUrl,
    };
}

@AuthenticatedComponent
@translate('OtherUserAnswersPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswersPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user           : PropTypes.object.isRequired,
        // Injected by React Router:
        params    : PropTypes.shape({
            slug : PropTypes.string,
        }),
        selected : PropTypes.string,
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        otherUser : PropTypes.object,
        otherUserQuestions : PropTypes.object,
        userQuestions : PropTypes.object,
        otherNotAnsweredQuestions : PropTypes.object,
        isLoadingOwnQuestions: PropTypes.bool,
        requestQuestionsUrl  : PropTypes.string,

    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        // this.onClickSelectCollapsible = this.onClickSelectCollapsible.bind(this);
        this.onClickEditQuestion = this.onClickEditQuestion.bind(this);

        this.onBottomScroll = this.onBottomScroll.bind(this);

        // this.state = {
        //     selected: 'affinity',
        // };
    }

    componentDidMount() {
        window.setTimeout(() => requestData(this.props), 0);
    }

    topNavBarLeftLinkClick() {

    }

    // onClickSelectCollapsible(orderCriteria) {
    //     const {user, strings, otherUser, otherUserQuestions, userQuestions, params} = this.props;
    //     QuestionActionCreators.orderQuestions(orderCriteria, otherUserQuestions, userQuestions);
    // }

    onClickEditQuestion(questionId) {
        const {user} = this.props;
        //this.context.router.push(`/answer-question/${questionId}/${user.slug}`);
    }

    renderMatch(otherQuestion, ownQuestion, otherUser, user) {
        return (
            <QuestionMatch otherQuestion={otherQuestion} ownQuestion={ownQuestion} otherUser={otherUser} user={user}/>
        );
    }

    renderPartialMatch(otherQuestion, ownQuestion, otherUser, user) {
        return (
            <QuestionPartialMatch otherQuestion={otherQuestion} ownQuestion={ownQuestion} otherUser={otherUser} user={user}/>
        );
    }

    renderNotMatch(otherQuestion, ownQuestion, otherUser, user) {
        return (
            <QuestionNotMatch otherQuestion={otherQuestion} ownQuestion={ownQuestion} otherUser={otherUser} user={user}/>
        );
    }

    onTimerEnd(questionId) {
        QuestionActionCreators.setQuestionEditable(questionId);
    }

    onBottomScroll() {
        console.log('onBottomScroll');
        const {user, requestQuestionsUrl, isLoadingOwnQuestions} = this.props;
        console.log(requestQuestionsUrl);
        console.log(isLoadingOwnQuestions);
        console.log(user);
        if (isLoadingOwnQuestions || !requestQuestionsUrl) {
            return Promise.resolve();
        }
        return QuestionActionCreators.requestQuestions(user.id, requestQuestionsUrl);
    }

    getQuestions() {
        const {user, strings, otherUser, otherUserQuestions, userQuestions, otherNotAnsweredQuestions, isLoadingOwnQuestions, requestQuestionsUrl} = this.props;
        const questionComponents = Object.keys(otherNotAnsweredQuestions).map((question, questionIndex) =>
            <div key={questionIndex}>
                <AnswerQuestionCard
                    question={otherNotAnsweredQuestions[question]}
                    otherUser={otherUser}/>
            </div>
        );

        console.log(questionComponents);




        // const questionComponents = Object.keys(questions).map((questionId, index) =>
        //     <div key={index} className="question-list">
        //         <Question userSlug={userSlug}
        //                   userAnswer={questions[questionId].userAnswer}
        //                   ownPicture={ownPicture}
        //                   defaultPicture={defaultPicture}
        //                   key={index}
        //                   accessibleKey={index}
        //                   question={questions[questionId]}
        //                   last={index === questions.length}
        //                   onClickHandler={this.onClickHandler}
        //                   onTimerEnd={onTimerEnd}
        //                   graphActive={this.state.graphDisplayQuestionId === questionId}
        //         />
        //     </div>);

        return isLoadingOwnQuestions && questionComponents.length === 0 ?
            [<div key="empty-message"><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
            : questionComponents;
    }

    render() {
        const {user, strings, otherUser, otherUserQuestions, userQuestions, otherNotAnsweredQuestions, isLoadingOwnQuestions} = this.props;

        return (
            <div className="views">
                <div className="view view-main other-user-answers-view">
                    <TopNavBar
                        background={'FFFFFF'}
                        iconLeft={'arrow-left'}
                        textCenter={otherUser ? strings.topNavBarText.replace('%username%', otherUser.username) : ''}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                    <div className="other-user-answers-view-wrapper">
                        {/*<div className="select-collapsible-wrapper">*/}
                            {/*<SelectCollapsible*/}
                            {/*selected={'affinity'}*/}
                            {/*options={options}*/}
                            {/*onClickSelectCollapsible={this.onClickSelectCollapsible}/>*/}
                        {/*</div>*/}

                        {otherUserQuestions && userQuestions ?
                            Object.keys(otherUserQuestions).map((question, questionIndex) =>
                                otherUserQuestions[question].userAnswer.answerId === userQuestions[question].userAnswer.answerId ?
                                    <div key={questionIndex}>{this.renderMatch(otherUserQuestions[question], userQuestions[question], otherUser, user)}</div>
                                :
                                    otherUserQuestions[question].userAnswer.acceptedAnswers.indexOf(userQuestions[question].userAnswer.answerId) !== -1 ?
                                        <div key={questionIndex}>{this.renderPartialMatch(otherUserQuestions[question], userQuestions[question], otherUser, user)}</div>
                                    :
                                        <div key={questionIndex}>{this.renderNotMatch(otherUserQuestions[question], userQuestions[question], otherUser, user)}</div>
                            )
                            : ''
                        }

                        <h3 className='other-user-answer-questions-title'>Comprueba si sois compatibles</h3>

                        <div id={'other-user-answer-questions-wrapper'} className='other-user-answer-questions-wrapper'>
                            {otherNotAnsweredQuestions && Object.keys(otherNotAnsweredQuestions).length > 0 ?
                                <Scroll
                                    items={this.getQuestions()}
                                    // firstItems={}
                                    // onLoad={this.onBottomScroll()}
                                    onLoad={this.onBottomScroll}
                                    containerId="other-user-answer-questions-wrapper"
                                    loading={isLoadingOwnQuestions}
                                    columns={1}
                                />
                            : ''}

                        </div>
                    </div>
                </div>
                <OtherUserBottomNavBar userSlug={otherUser && otherUser.slug} current={'answers'}/>
            </div>
        );
    }
}

AnswersPage.defaultProps = {
    strings: {
        topNavBarText : '%username% answers',
        affinity      : 'Affinity',
        compatibility : 'Compatibility',
        loading       : 'Loading questions',
    }
};