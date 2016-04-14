import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightRecommendationIcons extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-30 right">
				<div className="icon-wrapper">
					{/* TODO: Link to Edit Threads */}
					<span className="icon-edit">
					</span>
				</div>
			</div>
		);
	}
}