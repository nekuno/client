import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '../../../scss/pages/own-user/answers.scss';
import translate from '../../i18n/Translate';
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import UserStore from "../../stores/UserStore";
import QuestionStore from "../../stores/QuestionStore";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import Button from "../../components/ui/Button/Button";
import styles from "../../components/ui/QuestionNotMatch/QuestionNotMatch.scss";
import RoundedImage from "../../components/ui/RoundedImage/RoundedImage";
import * as QuestionActionCreators from "../../actions/QuestionActionCreators";
import * as UserActionCreators from "../../actions/UserActionCreators";
import Scroll from "../../components/Scroll/Scroll";
import AnswerQuestionCard from "../../components/ui/AnswerQuestionCard/AnswerQuestionCard";
import EmptyMessage from "../../components/ui/EmptyMessage";
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";

function requestData(props) {
    // const user = UserActionCreators.requestUser(props.params.slug);
    QuestionActionCreators.requestQuestionsBySlug(props.params.slug);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userQuestions = props.user ? QuestionStore.get(props.user.id) : null;

    const isLoadingOwnQuestions = QuestionStore.isLoadingComparedQuestions();
    const requestQuestionsUrl = QuestionStore.getRequestComparedQuestionsUrl(props.user.id, []);

    return {
        userQuestions,
        isLoadingOwnQuestions,
        requestQuestionsUrl,
    };
}

@AuthenticatedComponent
@translate('OwnUserAnswersPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswersPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                      : PropTypes.object.isRequired,
        // Injected by React Router:
        params                 : PropTypes.shape({
            slug: PropTypes.string,
        }),
        // Injected by @translate:
        strings                   : PropTypes.object,
        // Injected by @connectToStores:
        userQuestions             : PropTypes.object,
        isLoadingOwnQuestions     : PropTypes.bool,
        requestQuestionsUrl       : PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);

        this.firstItems = this.firstItems.bind(this);

        this.onBottomScroll = this.onBottomScroll.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
        // window.setTimeout(() => requestData(this.props), 0);
    }

    topNavBarLeftLinkClick() {

    }

    getQuestions() {
        const {strings, userQuestions, isLoadingOwnQuestions} = this.props;

        const questionComponents = Object.keys(userQuestions).map((question, questionIndex) =>
            <div key={questionIndex} className="user-question-card">
                <h3>{userQuestions[question].question.text}</h3>
                {userQuestions[question].question.answers.map((answer, answerIndex) =>
                    <div>
                        {userQuestions[question].userAnswer.acceptedAnswers.map((acceptedAnswer, acceptedAnswerIndex) =>
                            <div>
                                {acceptedAnswer === answer.answerId ?
                                <div key={answerIndex} className="user-question-card-answer">
                                    <div className="photo">
                                        {userQuestions[question].userAnswer.answerId === answer.answerId ?
                                            <RoundedImage size={'x-small'} url="https://dummyimage.com/600x400/ff0000/fff"/>
                                            :
                                            <RoundedImage size={'x-small'} url="https://dummyimage.com/25x25/000/fff"/>
                                        }

                                    </div>
                                    <div className="answer">
                                        {answer.text}
                                    </div>
                                </div>
                                : null
                                }
                            </div>
                        )}
                    </div>
                )}
                {userQuestions[question].userAnswer.isEditable ?
                    <div className="edit-answer">{strings.editAnswer}</div>
                    : null
                }
            </div>
        );
        return isLoadingOwnQuestions && questionComponents.length === 0 ?
            [<div key="empty-message"><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
            : questionComponents;
    }

    firstItems() {
        const {strings, userQuestions, isLoadingOwnQuestions} = this.props;

        return [
            <div className={"first-items"}>
                <div className="user-answer-presentation-card">
                    <div className="user-answer-presentation-card-title">
                        <img src="https://dummyimage.com/75x75/000/fff"/>
                        <h2>{strings.myAnswersTitle}</h2>
                    </div>
                    <div className="user-answer-presentation-card-description">{strings.myAnswersDescription}</div>
                    <div className="user-answer-presentation-card-button">
                        <Button textAlign={'left'} size={'small'} backgroundColor={'#928bff'}>
                            {strings.myAnswersButton}
                        </Button>
                    </div>
                </div>
                <h3>{strings.answeredQuestions}</h3>
            </div>
        ]
    }

    onBottomScroll() {
        const {user, requestQuestionsUrl, isLoadingOwnQuestions} = this.props;

        if (isLoadingOwnQuestions || !requestQuestionsUrl) {
            return Promise.resolve();
        }
        return QuestionActionCreators.requestQuestions(user.id, requestQuestionsUrl);
        // return QuestionActionCreators.requestComparedQuestions(user.id, requestQuestionsUrl);
    }

    render() {
        const {strings, userQuestions, isLoadingOwnQuestions} = this.props;

        return (
            <div className="views">
                <div id={'user-answers-view'} className="view view-main user-answers-view">
                    <TopNavBar
                        background={'FFFFFF'}
                        iconLeft={'arrow-left'}
                        textCenter={strings.topNavBarText}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                    <div className="user-answers-view-wrapper">
                        {userQuestions ?
                            <Scroll
                                items={this.getQuestions()}
                                firstItems={this.firstItems()}
                                onLoad={this.onBottomScroll}
                                containerId="user-answers-view"
                                loading={isLoadingOwnQuestions}
                                columns={1}
                            />
                            : null
                        }
                    </div>
                </div>
                <OwnUserBottomNavBar current={"answers"}/>
            </div>
        );
    }
}

AnswersPage.defaultProps = {
    strings: {
        topNavBarText        : 'My answers',
        myAnswersTitle       : 'We want to know you better!',
        myAnswersDescription : 'The more questions about your personality you answer, the better recommendations we can make.',
        myAnswersButton      : 'Answer the test',
        answeredQuestions    : 'You have answered 1 of 100 questions',
        editAnswer           : 'Edit answer',
    }
};