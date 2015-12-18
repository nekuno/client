import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import RecommendationContent from './RecommendationContent';
import RecommendationUser from './RecommendationUser';
import ChipList from './../ui/ChipList';

export default class RecommendationList extends Component {
    static propTypes = {
        recommendations: PropTypes.object.isRequired,
        thread: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let thread = this.props.thread;
        let recommendationList = [];
        let recommendationsLength = this.getObjectLength(this.props.recommendations);
        let counter = 0;
        for (let recommendationId in this.props.recommendations) {
            if (this.props.recommendations.hasOwnProperty(recommendationId)) {
                let recommendation = this.props.recommendations[recommendationId];
                recommendationList[counter++] = thread.category === 'ThreadUsers' ?
                    <RecommendationUser recommendation={recommendation} last={counter == recommendationsLength} /> :
                    <RecommendationContent recommendation={recommendation} last={counter == recommendationsLength} />;
            }
        }

        return (
            <div className="recommendation-page">
                <div className="thread-title">
                    {this.props.thread.name}
                </div>
                {this.renderChipList(this.props.thread)}

                <div className="recommendation-list">
                    {recommendationList.map(recommendation => recommendation)}
                </div>
            </div>
        );


    }

    renderChipList = function(thread) {
        let chips = [];

        if (thread.category === 'ThreadContent') {
            chips.push({'label': 'Contenidos'});
            if (thread.type) {
                chips.push({'label': thread.type});
            }
            if (thread.tag) {
                chips.push({'label': thread.tag});
            }
        } else {
            chips.push({'label': 'Contenidos'});
            /* TODO: Get real filters here */
            chips.push({'label': 'Edad: 20-35'});
        }

        return (
            <ChipList chips={chips} small={false} />
        );
    };

    getObjectLength = function(obj) {
        let size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

}
