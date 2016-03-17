import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftLink from './TopLeftLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightSearchLink from './TopRightSearchLink';

export default class LeftLinkRightSearchTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		leftText: PropTypes.string,
		onLeftLinkClickHandler: PropTypes.func,
		onRightLinkClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftLink text={this.props.leftText} onClickHandler={this.props.onLeftLinkClickHandler} />
						<RegularTopTitle text={this.props.centerText} textSize={this.props.centerTextSize} />
						<TopRightSearchLink onClickHandler={this.props.onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}