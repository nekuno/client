import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { QUESTION_STATS_COLORS } from '../../constants/Constants';
import Chart from 'chart.js';
import translate from '../../i18n/Translate';
import styles from './QuestionStatsGraphs.scss';

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
            percentageInnerCutout: 70,
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
        let firstGraphClass = "young-answer-chart-" + userAnswer.answerId;
        let secondGraphClass = "old-answer-chart-" + userAnswer.answerId;
        if (isGenderDiffGreater) {
            firstProperty = "femaleAnswersCount";
            secondProperty = "maleAnswersCount";
            firstGraphClass = "female-answer-chart-" + userAnswer.answerId;
            secondGraphClass = "male-answer-chart-" + userAnswer.answerId;
        }
        let firstStats = [];
        let secondStats = [];
        question.answers.forEach((answer, index) => {
            firstStats.push({
                value: this.getPercentage(answer[firstProperty], question[firstProperty]),
                color: QUESTION_STATS_COLORS[index]
            });
            secondStats.push({
                value: this.getPercentage(answer[secondProperty], question[secondProperty]),
                color: QUESTION_STATS_COLORS[index]
            });
        });

        let firstElem = this.refs.firstGraphClass;
        let secondElem = this.refs.secondGraphClass;


        let canvasWidth = firstElem.style.width;
        let canvasHeight = firstElem.style.height;

        firstElem.width = canvasWidth;
        firstElem.height = canvasHeight;
        secondElem.width = canvasWidth;
        secondElem.height = canvasHeight;

        let ctx1 = firstElem.getContext("2d");
        let ctx2 = secondElem.getContext("2d");

        if (question[firstProperty]) {
            new Chart(ctx1).Doughnut(firstStats, options);
        }
        if (question[secondProperty]) {
            new Chart(ctx2).Doughnut(secondStats, options);
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
        const firstGraphClass = isGenderDiffGreater ? "female-answer-chart-" + userAnswer.answerId : "young-answer-chart-" + userAnswer.answerId;
        const secondGraphClass = isGenderDiffGreater ? "male-answer-chart-" + userAnswer.answerId : "old-answer-chart-" + userAnswer.answerId;
        const firstText = isGenderDiffGreater ? strings.females : strings.young;
        const secondText = isGenderDiffGreater ? strings.males : strings.old;
        const statsType = isGenderDiffGreater ? strings.typeGender : strings.typeAge;

        return (
            <div className={styles.communityQuestionStats}>
                <div className={styles.questionStatsGraphTitle}>
                    {strings.statistics + ' ' + statsType}
                </div>
                <div className={styles.chartsContainer}>
                    <div className={styles.firstChart}>
                        <div className="stats-text">{firstText}</div>
                        <canvas ref={'firstGraphClass'}
                                style={{display: 'block', width: '100px', height: '100px'}}
                                id={firstGraphClass}></canvas>
                        <div className={firstIcon}></div>
                    </div>
                    <div className={styles.secondChart}>
                        <div className="stats-text">{secondText}</div>
                        <canvas ref={'secondGraphClass'}
                                style={{display: 'block', width: '100px', height: '100px'}}
                                id={secondGraphClass}></canvas>
                        <div className={secondIcon}></div>
                    </div>
                </div>
            </div>
        );
    }
}

QuestionStatsGraph.defaultProps = {
    strings: {
        statistics: 'Statistics answers community',
        females   : 'Girls',
        males     : 'Boys',
        young     : '- than 30',
        old       : '+ than 30',
        typeGender: 'distribution by gender',
        typeAge   : 'distribution by age',
    }
};