import React, { PropTypes, Component } from 'react';
import RecommendationContent from './RecommendationContent';
import RecommendationUser from './RecommendationUser';
import ChipList from './../ui/ChipList';

export default class RecommendationList extends Component {
    static propTypes = {
        recommendations: PropTypes.array.isRequired,
        thread         : PropTypes.object.isRequired,
        userId         : PropTypes.number.isRequired
    };

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
            chips.push({'label': 'Personas'});
            /* TODO: Get real filters here */
            chips.push({'label': 'Edad: 22-32'});
            chips.push({'label': 'a 10km de Madrid'});
            chips.push({'label': 'Mujer'});
        }

        return (
            <ChipList chips={chips} small={true}/>
        );
    };

    getObjectLength = function(obj) {
        let size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    render() {
        let thread = this.props.thread;
        let recommendationList = [];
        let recommendationsLength = this.getObjectLength(this.props.recommendations);
        let counter = 0;
        for (let recommendationId in this.props.recommendations) {
            if (this.props.recommendations.hasOwnProperty(recommendationId)) {
                let recommendation = this.props.recommendations[recommendationId];
                recommendationList[counter++] = thread.category === 'ThreadUsers' ?
                    <RecommendationUser userId={this.props.userId} key={counter} accessibleKey={counter} recommendation={recommendation} last={counter == recommendationsLength}/> :
                    <RecommendationContent userId={this.props.userId} key={counter} accessibleKey={counter} recommendation={recommendation} last={counter == recommendationsLength}/>;
            }
        }

        return (
            <div className="recommendation-content">
                <div className="title thread-title">
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

}
