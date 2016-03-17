import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TopLeftMenuLink from './TopLeftMenuLink';
import RegularTopTitle from './RegularTopTitle';
import TopRightMessageLink from './TopRightMessageLink';

export default class OtherUserTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		userId: PropTypes.number,
		fixed: PropTypes.bool
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="navbar" style={ this.props.fixed ? {position: 'fixed'} : {} }>
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={this.props.centerText} textSize={this.props.centerTextSize} />
						<TopRightMessageLink userId={this.props.userId}/>
					</div>
				</div>
			</div>
		);
	}
}