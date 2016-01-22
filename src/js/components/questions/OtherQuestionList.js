import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import OtherQuestion from './OtherQuestion';

export default class OtherQuestionList extends Component {
    static propTypes = {
        questions: PropTypes.object.isRequired,
        otherQuestions: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        otherPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {
        let questions = this.props.questions;
        let otherQuestions = this.props.otherQuestions;
        let questionList = [];
        let questionsLength = this.getObjectLength(otherQuestions);
        let counter = 0;
        for (let questionId in otherQuestions) {
            if (otherQuestions.hasOwnProperty(questionId)) {
                let otherQuestion = otherQuestions[questionId];
                let question = selectn(questionId, questions);
                let userAnswer = selectn('userAnswer', question);
                questionList[counter++] = <OtherQuestion userId={this.props.userId} otherUserAnswer={otherQuestion.userAnswer} userAnswer={userAnswer} ownPicture={this.props.ownPicture} otherPicture={this.props.otherPicture} key={counter} accessibleKey={counter} question={otherQuestion} last={counter == questionsLength} />
            }
        }
        return (
            <div className="question-list">
                {questionList.map(question => question)}
            </div>
        );
    }

    getObjectLength = function(obj) {
        let size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

}
