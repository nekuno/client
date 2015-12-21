import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftIcon from '../ui/TopLeftIcon';
import RegularTopTitle from '../ui/RegularTopTitle';
import TopRightRecommendationIcons from '../ui/TopRightRecommendationIcons';

export default class RecommendationsTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftIcon icon={'left-arrow'} />
						<RegularTopTitle text={this.props.centerText} />
						<TopRightRecommendationIcons />
					</div>
				</div>
			</div>
		);
	}
}