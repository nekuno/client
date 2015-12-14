import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftLink from './TopLeftLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightLink from './TopRightLink';

export default class RegularTopNavbar extends Component {
	static propTypes = {
		leftText: PropTypes.string,
		centerText: PropTypes.string,
		rightText: PropTypes.string
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftLink text={this.props.leftText} />
						<RegularTopTitle text={this.props.centerText} />
						<TopRightLink text={this.props.rightText} />
					</div>
				</div>
			</div>
		);
	}
}