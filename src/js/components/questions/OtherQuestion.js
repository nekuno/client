import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Answer from './Answer';
import translate from '../../i18n/Translate';

@translate('OtherQuestion')
export default class OtherQuestion extends Component {
    static propTypes = {
        question       : PropTypes.object.isRequired,
        userAnswer     : PropTypes.object,
        otherUserAnswer: PropTypes.object.isRequired,
        ownPicture     : PropTypes.string.isRequired,
        otherPicture   : PropTypes.string.isRequired,
        last           : PropTypes.bool.isRequired,
        userId         : PropTypes.number.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    render() {
        let question = this.props.question.question;
        if (!question) {
            return null;
        }
        let userAnswer = this.props.userAnswer || {};
        let otherUserAnswer = this.props.otherUserAnswer;
        const {strings} = this.props;

        userAnswer.text = otherUserAnswer.text = strings.didntAnswered;
        question.answers.forEach((answer) => {
            if (answer.answerId === userAnswer.answerId) {
                userAnswer.text = answer.text;
            }
            if (answer.answerId === otherUserAnswer.answerId) {
                otherUserAnswer.text = answer.text;
            }
        });

        return (
            <div className="question">
                <div className="edit-question-button">
                    <Link to={`/answer-question/${question.questionId}`}><span className="icon-edit"></span></Link>
                </div>
                <div className="question-title">
                    {question.text}
                </div>
                <Answer text={otherUserAnswer.text} answered={false} defaultPicture={this.props.otherPicture} {...this.props} />
                {userAnswer.text ?
                    <Answer text={userAnswer.text} answered={true} {...this.props} />
                    :
                    <div className="not-answered-text">{strings.didntAnswered}</div>
                }
                <hr/>
            </div>
        );
    }
}

OtherQuestion.defaultProps = {
    strings: {
        didntAnswered: 'You have not answered this question'
    }
};