import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import Question from './Question';
import ChipList from './../ui/ChipList';

export default class QuestionList extends Component {
    static propTypes = {
        questions: PropTypes.object.isRequired,
        answers: PropTypes.object.isRequired,
        userAnswers: PropTypes.object.isRequired,
        ownPicture: PropTypes.string.isRequired,
        defaultPicture: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let answers = this.props.answers;
        let questions = this.props.questions.items;
        let questionList = [];
        let questionsLength = this.getObjectLength(questions);
        let counter = 0;
        for (let questionId in questions) {
            if (questions.hasOwnProperty(questionId)) {
                let question = questions[questionId];
                questionList[counter++] = <Question userId={this.props.userId} answers={answers} userAnswers={this.props.userAnswers} ownPicture={this.props.ownPicture} defaultPicture={this.props.defaultPicture} key={counter} accessibleKey={counter} question={question} last={counter == questionsLength} />
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
