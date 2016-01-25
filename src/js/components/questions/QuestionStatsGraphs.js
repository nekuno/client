import React, { PropTypes, Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import Chart from 'chart.js';

export default class QuestionStatsGraph extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired
    };

    componentDidMount() {
        let question = this.props.question;
        let userAnswer = this.props.userAnswer;
        if (!question || !userAnswer) {
            return;
        }

        let options = {
            segmentShowStroke: false,
            percentageInnerCutout : 55,
            tooltipTemplate: "<%= value %>%"
        };

        this.initQuestionStatsGraphs(question, userAnswer, options);
    }

    render() {
        let userAnswer = this.props.userAnswer;
        let question = this.props.question;
        if (!question) {
            return null;
        }

        return (
            <div className="community-question-stats">
                <div className="female-answer-chart-container">
                    <canvas id={"female-answer-chart-" + userAnswer.answerId}></canvas>
                    <div className="icon-female genre-icon"></div>
                    <div className="genre-text female">Chicas</div>
                </div>
                <div className="male-answer-chart-container">
                    <canvas id={"male-answer-chart-" + userAnswer.answerId}></canvas>
                    <div className="icon-male genre-icon"></div>
                    <div className="genre-text male">Chicos</div>
                </div>
            </div>
        );
    }

    getPercentage = function(count, totalCount) {
        return count && totalCount ? Math.round(count/totalCount*100) : 0;
    };

    initQuestionStatsGraphs(question, userAnswer, options) {
        let femaleStats = [];
        let maleStats = [];
        question.answers.forEach((answer, index) => {
            femaleStats.push({
                value: this.getPercentage(answer.femaleAnswersCount, question.femaleAnswersCount),
                color: QUESTION_STATS_COLORS[index]
            });
            maleStats.push({
                value: this.getPercentage(answer.maleAnswersCount, question.maleAnswersCount),
                color: QUESTION_STATS_COLORS[index]
            });
        });

        let femaleElem = document.getElementById("female-answer-chart-" + userAnswer.answerId);
        let maleElem = document.getElementById("male-answer-chart-" + userAnswer.answerId);
        let canvasWidth = femaleElem.style.width;
        let canvasHeight = femaleElem.style.height;

        femaleElem.width = canvasWidth;
        femaleElem.height = canvasHeight;
        maleElem.width = canvasWidth;
        maleElem.height = canvasHeight;

        let ctx1 = femaleElem.getContext("2d");
        let ctx2 = maleElem.getContext("2d");

        if (question.femaleAnswersCount) {
            new Chart(ctx1).Doughnut(femaleStats, options);
        }
        if (question.maleAnswersCount) {
            new Chart(ctx2).Doughnut(maleStats, options);
        }
    }
}
