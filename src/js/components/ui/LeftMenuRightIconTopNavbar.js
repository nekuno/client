import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftMenuLink from './TopLeftMenuLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightIconLink from './TopRightIconLink';

export default class LeftMenuRightIconTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		rightIcon: PropTypes.string.isRequired,
		onRightLinkClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {centerText, centerTextSize, rightIcon, onRightLinkClickHandler} = this.props;
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={centerText} textSize={centerTextSize} />
						<TopRightIconLink icon={rightIcon} onClickHandler={onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}