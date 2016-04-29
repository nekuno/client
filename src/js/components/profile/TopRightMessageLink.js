import React, { PropTypes, Component } from 'react';

export default class TopRightMessageLink extends Component {
	static propTypes = {
		onClickMessageLink: PropTypes.func.isRequired
	};

	render() {
		return (
			<div className="col-30 right">
				<div className="send-message-button icon-wrapper" onClick={this.props.onClickMessageLink}>
					<span className="icon-message"></span>
				</div>
			</div>
		);
	}
}