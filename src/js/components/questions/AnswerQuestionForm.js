import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import AnswerRadio from './AnswerRadio';
import AcceptedAnswerCheckbox from './AcceptedAnswerCheckbox';
import AcceptedAnswersImportance from '../ui/AcceptedAnswersImportance';

export default class AnswerQuestionForm extends Component {
    static propTypes = {
        answers: PropTypes.array.isRequired,
        userAnswer: PropTypes.object,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOnClickAnswer = this.handleOnClickAnswer.bind(this);
        this.handleOnClickAcceptedAnswer = this.handleOnClickAcceptedAnswer.bind(this);

        this.state = {
            answered: false,
            acceptedAnswersCount: 0
        };
    }

    render() {
        let userAnswer = this.props.userAnswer;
        let answers = this.props.answers;

        if (!answers) {
            return null;
        }

        return (
            <div className="answer-question-form">
                <form>
                    <div className="answers-block">
                        <div className="list-block accepted-answers">
                            <ul>
                                {answers.map((answer, index) => {
                                    return (
                                        <AcceptedAnswerCheckbox key={index} answer={answer} checked={false} onClickHandler={this.handleOnClickAcceptedAnswer} {...this.props} />
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="list-block answers">
                            <ul>
                                {answers.map((answer, index) => {
                                    return (
                                        <AnswerRadio key={index} answer={answer} checked={false} onClickHandler={this.handleOnClickAnswer} {...this.props} />
                                    );
                                })}
                            </ul>
                        </div>
                        <AcceptedAnswersImportance irrelevant={this.state.acceptedAnswersCount === answers.length} answeredAndAccepted={this.state.answered && this.state.acceptedAnswersCount} />
                    </div>
                </form>
            </div>
        );
    }

    handleOnClickAcceptedAnswer(event) {
        if (!this.state.answered) {
            nekunoApp.alert('Marca primero tu respuesta');
            event.target.checked = false;
            return;
        }

        let acceptedAnswersCount = event.target.checked ? this.state.acceptedAnswersCount + 1 : this.state.acceptedAnswersCount - 1;

        this.setState({
            acceptedAnswersCount: acceptedAnswersCount
        });

    }

    handleOnClickAnswer() {
        if (!this.state.answered) {
            nekunoApp.alert('Marca una o varias opciones en la segunda columna para indicar qué te gustaría que respondiera otro usuario');
            this.setState({
                answered: true
            });
        }
    }
}
