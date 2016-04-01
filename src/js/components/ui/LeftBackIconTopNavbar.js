import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftIcon from './TopLeftIcon';
import RegularTopTitle from './RegularTopTitle';
import TopRightLink from './TopRightLink';

export default class LeftBackIconTopNavbar extends Component {
	static propTypes = {
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
						<TopLeftIcon icon={'left-arrow'}/>
						<RegularTopTitle text={this.props.centerText} />
						<TopRightLink text={this.props.rightText} onClickHandler={this.props.onRightLinkClickHandler} />
					</div>
				</div>
			</div>
		);
	}
}