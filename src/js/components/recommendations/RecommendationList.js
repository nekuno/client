import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RecommendationContent from './RecommendationContent';
import RecommendationUser from './RecommendationUser';
import ChipList from './../ui/ChipList';
import FilterStore from './../../stores/FilterStore';

export default class RecommendationList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired,
        thread         : PropTypes.object.isRequired,
        filters        : PropTypes.object.isRequired,
        userId         : PropTypes.number.isRequired,
        ownPicture     : PropTypes.string,
        currentTab     : PropTypes.string,
        onTabClick     : PropTypes.func
    };

    renderChipList = function(thread, filters) {
        const threadFilters = thread.category === 'ThreadUsers' ? thread.filters.userFilters : thread.filters.contentFilters;
        let chips = [{label: thread.category === 'ThreadUsers' ? 'Personas' : 'Contenidos'}]
        Object.keys(threadFilters).filter(key => typeof filters[key] !== 'undefined').forEach(key => { 
            chips.push({label: FilterStore.getFilterLabel(filters[key], threadFilters[key])}) 
        });
        return (
            <ChipList chips={chips} small={true}/>
        );
    };

    render() {
        const {thread, recommendations, filters, userId, ownPicture, currentTab} = this.props;
        return (
            <div className={thread.category === 'ThreadUsers' ? "recommendation-users" : "recommendation-content"}>
                <div className="title thread-title">
                    {thread.name}
                </div>
                {this.renderChipList(thread, filters)}
                <div id="recommendations-swiper-container" className="swiper-container">
                    <div className="swiper-wrapper recommendation-list">
                        {thread.category === 'ThreadUsers' ? 
                            Object.keys(recommendations).map((key, index) => <RecommendationUser userId={userId} key={index} accessibleKey={index} recommendation={recommendations[key]} ownPicture={ownPicture} currentTab={currentTab} onTabClick={this.props.onTabClick}/>)
                            :
                            Object.keys(recommendations).map((key, index) => <RecommendationContent userId={userId} key={index} accessibleKey={index} recommendation={recommendations[key]}/>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}
