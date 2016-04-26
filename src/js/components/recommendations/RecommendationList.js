import React, { PropTypes, Component } from 'react';
import RecommendationContent from './RecommendationContent';
import RecommendationUser from './RecommendationUser';
import ChipList from './../ui/ChipList';
import FilterStore from './../../stores/FilterStore';

export default class RecommendationList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired,
        thread         : PropTypes.object.isRequired,
        filters        : PropTypes.object.isRequired,
        userId         : PropTypes.number.isRequired
    };

    renderChipList = function(thread, filters) {
        const chips = Object.keys(thread.filters).filter(key => typeof filters[key] !== 'undefined').map(key => { return {label: FilterStore.getFilterLabel(filters[key], thread.filters[key])} });
        return (
            <ChipList chips={chips} small={true}/>
        );
    };

    render() {
        const {thread, recommendations, filters, userId} = this.props;
        return (
            <div className="recommendation-content">
                <div className="title thread-title">
                    {thread.name}
                </div>
                {this.renderChipList(thread, filters)}
                <div className="swiper-container">
                    <div className="swiper-wrapper recommendation-list">
                        {thread.category === 'ThreadUsers' ? 
                            Object.keys(recommendations).map((key, index) => <RecommendationUser userId={userId} key={index} accessibleKey={index} recommendation={recommendations[key]}/>)
                            :
                            Object.keys(recommendations).map((key, index) => <RecommendationContent userId={userId} key={index} accessibleKey={index} recommendation={recommendations[key]}/>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}
