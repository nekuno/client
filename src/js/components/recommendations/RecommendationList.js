import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';
import RecommendationContent from './RecommendationContent';
import RecommendationUser from './RecommendationUser';
import ChipList from './../ui/ChipList';

export default class RecommendationList extends Component {
    static propTypes = {
        recommendations: PropTypes.array.isRequired,
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
                    <RecommendationUser key={counter} accessibleKey={counter} recommendation={recommendation} last={counter == recommendationsLength} /> :
                    <RecommendationContent key={counter} accessibleKey={counter} recommendation={recommendation} last={counter == recommendationsLength} />;
            }
        }

        return (
            <div className="recommendation-content">
                <div className="thread-title">
                    {this.props.thread.name}
                </div>
                {this.renderChipList(this.props.thread)}

                <div className="swiper-container">
                    <div className="swiper-wrapper recommendation-list">
                        {recommendationList.map(recommendation => recommendation)}
                    </div>
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
            <ChipList chips={chips} small={true} />
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
