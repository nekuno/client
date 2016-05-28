import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftMenuLink from './TopLeftMenuLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightLink from './TopRightLink';

export default class LeftMenuTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		rightText: PropTypes.string,
		onRightLinkClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {centerText, centerTextSize, rightText, onRightLinkClickHandler} = this.props;
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={centerText} textSize={centerTextSize} />
						<TopRightLink text={rightText} onClickHandler={onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}