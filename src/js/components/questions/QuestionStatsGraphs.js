import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import Chart from 'chart.js';
import translate from '../../i18n/Translate';

@translate('QuestionStatsGraph')
export default class QuestionStatsGraph extends Component {
    static propTypes = {
        question  : PropTypes.object.isRequired,
        userAnswer: PropTypes.object.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    componentDidMount() {
        let question = this.props.question;
        let userAnswer = this.props.userAnswer;
        if (!question || !userAnswer) {
            return;
        }

        let options = {
            segmentShowStroke    : false,
            percentageInnerCutout: 55,
            tooltipTemplate      : "<%= value %>%"
        };

        this.initQuestionStatsGraphs(question, userAnswer, options);
    }

    getPercentage = function(count, totalCount) {
        return count && totalCount ? Math.round(count / totalCount * 100) : 0;
    };

    initQuestionStatsGraphs(question, userAnswer, options) {
        const isGenderDiffGreater = this.isGenderDiffGreater(question);
        let firstProperty = "youngAnswersCount";
        let secondProperty = "oldAnswersCount";
        let thirdProperty;
        let firstGraphClass = "young-answer-chart-" + userAnswer.answerId;
        let secondGraphClass = "old-answer-chart-" + userAnswer.answerId;
        let thirdGraphClass = "nonbinary-answer-chart-" + userAnswer.answerId; // DEBUG
		
        if (isGenderDiffGreater) {
            firstProperty = "femaleAnswersCount";
            secondProperty = "maleAnswersCount";
            thirdProperty = "nbAnswersCount";
            firstGraphClass = "female-answer-chart-" + userAnswer.answerId;
            secondGraphClass = "male-answer-chart-" + userAnswer.answerId;
            thirdGraphClass = "nonbinary-answer-chart-" + userAnswer.answerId;
        }
        let firstStats = [];
        let secondStats = [];
        let thirdStats = [];
		
        question.answers.forEach((answer, index) => {
            firstStats.push({
                value: this.getPercentage(answer[firstProperty], question[firstProperty]),
                color: QUESTION_STATS_COLORS[index]
            });
            secondStats.push({
                value: this.getPercentage(answer[secondProperty], question[secondProperty]),
                color: QUESTION_STATS_COLORS[index]
			});
			thirdProperty && thirdStats.push({
                value: this.getPercentage(answer[thirdProperty], question[thirdProperty]),
                color: QUESTION_STATS_COLORS[index]
            });
        });

        let firstElem = document.getElementById(firstGraphClass);
        let secondElem = document.getElementById(secondGraphClass);
		let thirdElem = document.getElementById(thirdGraphClass);
		
        let canvasWidth = firstElem.style.width;
        let canvasHeight = firstElem.style.height;

        firstElem.width = canvasWidth;
        firstElem.height = canvasHeight;
        secondElem.width = canvasWidth;
        secondElem.height = canvasHeight;
        thirdElem.width = canvasWidth;
        thirdElem.height = canvasHeight;

        let ctx1 = firstElem.getContext("2d");
        let ctx2 = secondElem.getContext("2d");
        let ctx3 = thirdElem.getContext("2d");

        if (question[firstProperty]) {
            new Chart(ctx1).Doughnut(firstStats, options);
        }
        if (question[secondProperty]) {
            new Chart(ctx2).Doughnut(secondStats, options);
        }
        if (question[thirdProperty]) {
            new Chart(ctx3).Doughnut(thirdStats, options);
        }
    }

    isGenderDiffGreater = function(question) {
        let genderDiff = 0;
        let ageDiff = 0;
        question.answers.forEach((answer) => {
            genderDiff += Math.abs(answer.femaleAnswersCount - answer.maleAnswersCount);
            ageDiff += Math.abs(answer.youngAnswersCount - answer.oldAnswersCount);
        });

        return genderDiff > ageDiff;
    };

    render() {
        const {userAnswer, strings} = this.props;
        let question = this.props.question;
        if (!question) {
            return null;
        }
        const isGenderDiffGreater = this.isGenderDiffGreater(question);
        const firstIcon = isGenderDiffGreater ? 'icon-female stats-icon' : 'icon-cool stats-icon';
        const secondIcon = isGenderDiffGreater ? 'icon-male stats-icon' : 'icon-hipster stats-icon';
		const thirdIcon = isGenderDiffGreater ? 'icon mdi mdi-gender-non-binary' : null;

        const firstGraphClass = isGenderDiffGreater ? "female-answer-chart-" + userAnswer.answerId : "young-answer-chart-" + userAnswer.answerId
        const secondGraphClass = isGenderDiffGreater ? "male-answer-chart-" + userAnswer.answerId : "old-answer-chart-" + userAnswer.answerId
		const thirdGraphClass = isGenderDiffGreater ? "nonbinary-answer-chart-" + userAnswer.answerId : null

        const firstText = isGenderDiffGreater ? strings.females : strings.young;
        const secondText = isGenderDiffGreater ? strings.males : strings.old;
		const thirdText = isGenderDiffGreater ? strings.nb : null;

        const statsType = isGenderDiffGreater ? strings.typeGender : strings.typeAge;

        return (
            <div className="community-question-stats">
                <div className="question-stats-type">{statsType}</div>
                <div className="first-answer-chart-container">
                    <canvas id={firstGraphClass}></canvas>
                    <div className={firstIcon}></div>
                    <div className="stats-text">{firstText}</div>
                </div>
                <div className="second-answer-chart-container">
                    <canvas id={secondGraphClass}></canvas>
                    <div className={secondIcon}></div>
                    <div className="stats-text">{secondText}</div>
                </div>
                { thirdGraphClass ? // DEBUG
                    <div className="third-answer-chart-container">
                        <canvas id={thirdGraphClass}></canvas>
                    	<span className={thirdIcon}></span>
                        <div className="stats-text">{thirdText}</div>
                    </div>
                : ''}
            </div>
        );
    }
}

QuestionStatsGraph.defaultProps = {
    strings: {
        females   : 'Girls',
        males     : 'Boys',
        nb        : 'Non-binary',
        young     : '- than 30',
        old       : '+ than 30',
        typeGender: 'Distribution by gender',
        typeAge   : 'Distribution by age',
    }
};