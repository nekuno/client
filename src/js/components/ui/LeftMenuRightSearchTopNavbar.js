import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftMenuLink from './TopLeftMenuLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightSearchLink from './TopRightSearchLink';

export default class LeftMenuRightSearchTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		onRightLinkClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={this.props.centerText} textSize={this.props.centerTextSize} />
						<TopRightSearchLink onClickHandler={this.props.onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}