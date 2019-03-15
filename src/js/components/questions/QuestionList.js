import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Question from './Question';
import EmptyMessage from '../ui/EmptyMessage/EmptyMessage';
import Scroll from "../Scroll/Scroll";
import translate from '../../i18n/Translate';

@translate('QuestionList')
export default class QuestionList extends Component {
    static propTypes = {
        questions            : PropTypes.object.isRequired,
        ownPicture           : PropTypes.string.isRequired,
        defaultPicture       : PropTypes.string.isRequired,
        userSlug             : PropTypes.string.isRequired,
        onTimerEnd           : PropTypes.func,
        isLoadingOwnQuestions: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
        this.getQuestions = this.getQuestions.bind(this);

        this.state = {
            graphDisplayQuestionId: null
        };
    }

    onClickHandler(questionId) {
        this.setState({
            graphDisplayQuestionId: questionId
        });
    }

    getQuestions() {
        const {questions, userSlug, ownPicture, defaultPicture, onTimerEnd, isLoadingOwnQuestions, strings} = this.props;

        const questionComponents = Object.keys(questions).map((questionId, index) =>
            <div key={index} className="question-list">
                <Question userSlug={userSlug}
                          userAnswer={questions[questionId].userAnswer}
                          ownPicture={ownPicture}
                          defaultPicture={defaultPicture}
                          key={index}
                          accessibleKey={index}
                          question={questions[questionId]}
                          last={index === questions.length}
                          onClickHandler={this.onClickHandler}
                          onTimerEnd={onTimerEnd}
                          graphActive={this.state.graphDisplayQuestionId === questionId}
                />
            </div>);

        return isLoadingOwnQuestions && questionComponents.length === 0 ?
            [<div key="empty-message"><EmptyMessage text={strings.loading} loadingGif={true}/></div>]
            : questionComponents;
    }

    render() {
        return (
            <Scroll
                items={this.getQuestions()}
                firstItems={this.props.firstItems}
                onLoad={this.props.onBottomScroll}
                containerId="questions-view-main"
                loading={this.props.isLoadingOwnQuestions}
                columns={1}
            />
        );
    }
}

QuestionList.defaultProps = {
    strings : {
        loading: 'Loading questions'
    }
};
