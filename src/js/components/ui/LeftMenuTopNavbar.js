import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftMenuLink from './TopLeftMenuLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightLink from './TopRightLink';

export default class LeftMenuTopNavbar extends Component {
	static propTypes = {
		leftText: PropTypes.string,
		centerText: PropTypes.string,
		rightText: PropTypes.string,
		onRightLinkClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={this.props.centerText} />
						<TopRightLink text={this.props.rightText} onClickHandler={this.props.onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}