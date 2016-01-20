import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import Question from './Question';

export default class QuestionList extends Component {
    static propTypes = {
        questions: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    render() {
        let questions = this.props.questions;
        let questionList = [];
        let questionsLength = this.getObjectLength(questions);
        let counter = 0;
        for (let questionId in questions) {
            if (questions.hasOwnProperty(questionId)) {
                let question = questions[questionId];
                questionList[counter++] = <Question userId={this.props.userId} userAnswer={question.userAnswer} ownPicture={this.props.ownPicture} defaultPicture={this.props.defaultPicture} key={counter} accessibleKey={counter} question={question} last={counter == questionsLength} />
            }
        }
        return (
            <div className="question-list">
                {questionList.map(question => question)}

                <div className="loading-gif"></div>
                <br />
                <br />
                <br />
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
