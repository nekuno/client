import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightRecommendationIcons extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-25 right">
				<div className="inline-icons-wrapper">
					<div className="icon-wrapper" onClick={() => this.context.history.goBack()}>
						{/* TODO: Link to Create Threads */}
						<span className="icon-search">
						</span>
					</div>
					<div className="icon-wrapper">
						{/* TODO: Link to Edit Threads */}
						<span className="icon-edit">
						</span>
					</div>
				</div>
			</div>
		);
	}
}