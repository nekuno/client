import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import * as QuestionActionCreators from '../../actions/QuestionActionCreators';
import AnswerRadio from './AnswerRadio';
import AcceptedAnswerCheckbox from './AcceptedAnswerCheckbox';
import AcceptedAnswersImportance from './AcceptedAnswersImportance';
import EmptyMessage from '../ui/EmptyMessage/EmptyMessage';
import translate from '../../i18n/Translate';
import Framework7Service from '../../services/Framework7Service';
import styles from './AnswerQuestionForm.scss';
import RoundedImage from "../ui/RoundedImage/RoundedImage";
import RoundedIcon from "../ui/RoundedIcon/RoundedIcon";


@translate('AnswerQuestionForm')
export default class AnswerQuestionForm extends Component {
    static propTypes = {
        answers        : PropTypes.array.isRequired,
        userAnswer     : PropTypes.object,
        ownPicture     : PropTypes.string.isRequired,
        userId         : PropTypes.number.isRequired,
        question       : PropTypes.object.isRequired,
        startTutorial  : PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOnClickAnswer = this.handleOnClickAnswer.bind(this);
        this.handleOnClickAcceptedAnswer = this.handleOnClickAcceptedAnswer.bind(this);
        this.handleOnClickImportance = this.handleOnClickImportance.bind(this);

        this.state = {
            answerId       : selectn('userAnswer.answerId', props),
            acceptedAnswers: selectn('userAnswer.acceptedAnswers', props) ? props.userAnswer.acceptedAnswers : [],
            rated          : false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            answerId       : selectn('userAnswer.answerId', nextProps),
            acceptedAnswers: selectn('userAnswer.acceptedAnswers', nextProps) ? nextProps.userAnswer.acceptedAnswers : []
        });
    }

    answerQuestion(importance) {
        let userId = this.props.userId;
        let questionId = this.props.question.questionId;
        let answerId = this.state.answerId;
        let acceptedAnswers = this.state.acceptedAnswers;
        let rating = this.getRatingByImportance(importance);
        QuestionActionCreators.answerQuestion(userId, questionId, answerId, acceptedAnswers, rating);
    }

    handleOnClickAcceptedAnswer(checked, value) {
        if (!this.state.answerId) {
            Framework7Service.nekunoApp().alert(this.props.strings.alertFirst);
        }

        let acceptedAnswers = this.state.acceptedAnswers;
        let acceptedAnswerId = parseInt(value);
        if (checked) {
            acceptedAnswers.push(acceptedAnswerId);
        } else {
            acceptedAnswers = acceptedAnswers.filter(value => value !== acceptedAnswerId);
        }

        this.setState({
            acceptedAnswers: acceptedAnswers
        });
    }

    handleOnClickAnswer(value) {
        let answerId = parseInt(value);

        this.setState({
            answerId: answerId
        });
    }

    handleOnClickImportance(importance) {
        this.answerQuestion(importance);
        this.setState({
            rated: true
        });
    }

    getRatingByImportance = function(importance) {
        let rating;
        if (importance === 'few') {
            rating = 1;
        }
        else if (importance === 'normal') {
            rating = 2;
        }
        else if (importance === 'aLot') {
            rating = 3;
        }
        else if (importance === 'irrelevant') {
            rating = 0;
        }

        return rating;
    };

    render() {
        const {ownPicture, strings} = this.props;
        let answers = this.props.answers;
        let acceptedAnswers = selectn('userAnswer.acceptedAnswers', this.props) ? selectn('userAnswer.acceptedAnswers', this.props) : [];
        let userAnswerId = selectn('userAnswer.answerId', this.props);

        console.log();

        if (!answers) {
            return null;
        }
        const acceptedAnswersClassName = this.state.answerId ? "list-block accepted-answers" : "list-block accepted-answers disabled";

        return (
            this.state.rated ? <EmptyMessage text={strings.saving} loadingGif={true}/> :
            <div className="answer-question-form">
                <div className={styles.answerQuestionContainer}>
                    <div className={styles.header}>
                        <div className={styles.text}>Marca tu respuesta y las respuestas que aceptarías de otro usuario</div>
                        <div className={styles.image}>
                            <RoundedImage url={ownPicture} size={"x-small"}/>
                        </div>
                        <div className={styles.image}>
                            <RoundedIcon icon={'nekuno'} background={"#928bff"} size={'answer'}/>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.text}>Sí, lo más posible</div>
                        <div className={styles.image}>
                            <RoundedIcon background={"#928bff"} icon={'check'} size={'xx-small'}/>
                        </div>
                        <div className={styles.image}>
                            <RoundedImage url={"https://dummyimage.com/50x50/000/fff"} size={"xx-small"}/>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.text}>Me gusta, pero es demasiado caro</div>
                        <div className={styles.image}>
                            <RoundedIcon border={"1px solid #c5d0de"} background={"#ffffff"} icon={''} size={'xx-small'}/>
                        </div>
                        <div className={styles.image}>
                            <RoundedImage url={"https://dummyimage.com/50x50/000/fff"} size={"xx-small"}/>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.text}>No, me da igual si son orgánicos</div>
                        <div className={styles.image}>
                            <RoundedIcon background={"#928bff"} icon={'check'} size={'xx-small'}/>
                        </div>
                        <div className={styles.image}>
                            <RoundedImage url={"https://dummyimage.com/50x50/000/fff"} size={"xx-small"}/>
                        </div>
                    </div>
                </div>

                <form>
                    <div className="answers-block">
                        <div className={acceptedAnswersClassName}>
                            <div id="joyride-2-others-answers" className="answers-tutorial-block"></div>
                            <div className="answer-question-who-text">{strings.them}</div>
                            <div className="answer-question-picture">
                                <div className="answer-question-other-picture-container">
                                    <div className="answer-question-other-picture">
                                        <span className="icon-users"></span>
                                    </div>
                                </div>
                            </div>

                            <ul>
                                {answers.map((answer, index) => {
                                    let answerChecked = false;
                                    this.state.acceptedAnswers.forEach((answerId) => {
                                        if (answerId === answer.answerId) {
                                            answerChecked = true;
                                        }
                                    });
                                    return (
                                        <AcceptedAnswerCheckbox key={index} answer={answer} checked={answerChecked} onClickHandler={this.handleOnClickAcceptedAnswer}/>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="list-block answers">
                            <div id="joyride-1-your-answer" className="answers-tutorial-block"></div>
                            <div className="answer-question-who-text">{strings.you}</div>
                            <div className="answer-question-picture">
                                <div className="joyride-start-button-wrapper" onClick={this.props.startTutorial ? this.props.startTutorial.bind(true) : null}>
                                    <div className="joyride-start-button">?</div>
                                </div>
                                <div className="answer-question-own-picture-container">
                                    <div id="joyride-container-2" className="answer-question-own-picture">
                                        <img src={ownPicture}/>
                                    </div>
                                </div>
                            </div>
                            <ul>
                                {answers.map((answer, index) => {
                                    return (
                                        <AnswerRadio key={index} answer={answer} checked={this.state.answerId === answer.answerId} onClickHandler={this.handleOnClickAnswer}/>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className={styles.answerStepText}>
                            {!this.state.answerId ? strings.importance
                                : this.state.acceptedAnswers.length == 0 ? strings.importance
                                    : strings.importance
                            }
                        </div>
                        <AcceptedAnswersImportance irrelevant={this.state.acceptedAnswers.length === answers.length} answeredAndAccepted={this.state.answerId != null && this.state.acceptedAnswers.length > 0} onClickHandler={this.handleOnClickImportance}/>
                    </div>
                </form>
            </div>
        );
    }

}

AnswerQuestionForm.defaultProps = {
    strings: {
        you        : 'You',
        them       : 'Them',
        alertFirst : 'Mark your answer in the first column',
        saving     : 'Saving',
        yourAnswer : 'Your answer',
        theirAnswer: 'Answers which you accept from others',
        importance : 'Do you mind the user response?'
    }
};