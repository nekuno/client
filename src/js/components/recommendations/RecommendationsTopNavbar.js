import React, { PropTypes, Component } from 'react';
import TopLeftIcon from '../ui/TopLeftIcon';
import RegularTopTitle from '../ui/RegularTopTitle';
import TopRightRecommendationIcons from '../ui/TopRightRecommendationIcons';

export default class RecommendationsTopNavbar extends Component {
    static propTypes = {
        centerText: PropTypes.string,
        thread: PropTypes.object
    };

    render() {
        const {thread} = this.props;
        return (
            <div className="navbar">
                <div id="navbar-inner" className="navbar-inner">
                    <div className="row">
                        <TopLeftIcon icon={'left-arrow'}/>
                        <RegularTopTitle text={this.props.centerText}/>
                        <TopRightRecommendationIcons thread={thread} />
                    </div>
                </div>
            </div>
        );
    }
}