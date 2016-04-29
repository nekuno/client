import React, { PropTypes, Component } from 'react';
import TopLeftMenuLink from './../ui/TopLeftMenuLink';
import RegularTopTitle from './../ui/RegularTopTitle';
import TopRightMessageLink from './TopRightMessageLink';

export default class OtherUserTopNavbar extends Component {
	static propTypes = {
		centerText: PropTypes.string,
		centerTextSize: PropTypes.string,
		onClickMessageLink: PropTypes.func.isRequired
	};
	
	render() {
		return (
			<div className="navbar">
				<div id="navbar-inner" className="navbar-inner">
					<div className="row">
						<TopLeftMenuLink />
						<RegularTopTitle text={this.props.centerText} textSize={this.props.centerTextSize} />
						<TopRightMessageLink onClickMessageLink={this.props.onClickMessageLink}/>
					</div>
				</div>
			</div>
		);
	}
}