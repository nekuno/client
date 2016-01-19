import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import * as QuestionActionCreators from '../../actions/QuestionActionCreators';
import AnswerRadio from './AnswerRadio';
import AcceptedAnswerCheckbox from './AcceptedAnswerCheckbox';
import AcceptedAnswersImportance from '../ui/AcceptedAnswersImportance';

export default class AnswerQuestionForm extends Component {
    static propTypes = {
        answers: PropTypes.array.isRequired,
        userAnswer: PropTypes.object,
        isFirstQuestion: PropTypes.bool.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        question: PropTypes.object.isRequired
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOnClickAnswer = this.handleOnClickAnswer.bind(this);
        this.handleOnClickAcceptedAnswer = this.handleOnClickAcceptedAnswer.bind(this);
        this.handleOnClickImportance = this.handleOnClickImportance.bind(this);

        this.state = {
            answerId: null,
            acceptedAnswers: []
        };
    }

    answerQuestion(importance) {
        let userId = this.props.userId;
        let questionId = this.props.question.questionId;
        let answerId = this.state.answerId;
        let acceptedAnswers = this.state.acceptedAnswers;
        let rating = this.getRatingByImportance(importance);
        QuestionActionCreators.answerQuestion(userId, questionId, answerId, acceptedAnswers, rating);
    }

    render() {
        let answers = this.props.answers;
        let userAnswerId = selectn('userAnswer.answerId', this.props);

        if (!answers) {
            return null;
        }

        return (
            <div className="answer-question-form">
                <form>
                    <div className="answers-block">
                        <div className="list-block accepted-answers">
                            <div className="answer-question-picture">
                                <div className="answer-question-other-picture-container">
                                    <div className="answer-question-other-picture">
                                        <img src={this.props.defaultPicture} />
                                    </div>
                                </div>
                            </div>

                            <ul>
                                {answers.map((answer, index) => {
                                    return (
                                        <AcceptedAnswerCheckbox key={index} answer={answer} checked={userAnswerId === answer.answerId} onClickHandler={this.handleOnClickAcceptedAnswer}  />
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="list-block answers">
                            <div className="answer-question-picture">
                                <div className="answer-question-own-picture-container">
                                    <div className="answer-question-own-picture">
                                        <img src={this.props.ownPicture} />
                                    </div>
                                </div>
                            </div>
                            <ul>
                                {answers.map((answer, index) => {
                                    return (
                                        <AnswerRadio key={index} answer={answer} checked={userAnswerId === answer.answerId} onClickHandler={this.handleOnClickAnswer} />
                                    );
                                })}
                            </ul>
                        </div>
                        <AcceptedAnswersImportance irrelevant={this.state.acceptedAnswers.length === answers.length} answeredAndAccepted={this.state.answerId && this.state.acceptedAnswers.length > 0} onClickHandler={this.handleOnClickImportance} />
                    </div>
                </form>
            </div>
        );
    }

    handleOnClickAcceptedAnswer(event) {
        if (!this.state.answerId) {
            nekunoApp.alert('Marca primero tu respuesta');
            event.target.checked = false;
            return;
        }

        let acceptedAnswers = this.state.acceptedAnswers;
        let acceptedAnswerId = parseInt(event.target.value);
        if (event.target.checked) {
            acceptedAnswers.push(acceptedAnswerId);
        } else {
            acceptedAnswers = acceptedAnswers.filter(value => value !== acceptedAnswerId);
        }

        this.setState({
            acceptedAnswers: acceptedAnswers
        });
    }

    handleOnClickAnswer(event) {
        if (!this.state.answerId && this.props.isFirstQuestion) {
            nekunoApp.alert('Marca una o varias opciones en la segunda columna para indicar qué te gustaría que respondiera otro usuario');
        }

        let answerId = parseInt(event.target.value);

        this.setState({
            answerId: answerId
        });
    }

    handleOnClickImportance(importance) {
        this.answerQuestion(importance);
    }

    getRatingByImportance = function(importance) {
        let rating;
        if (importance === 'few') {
            rating = 0;
        }
        else if (importance === 'normal') {
            rating = 1;
        }
        else if (importance === 'aLot') {
            rating = 2;
        }
        else if (importance === 'irrelevant') {
            rating = 3;
        }

        return rating;
    };
}
