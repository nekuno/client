import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightMessageLink extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};
	static propTypes = {
		userId: PropTypes.number
	};

	constructor(props) {
		super(props);

		this.handleMessage = this.handleMessage.bind(this);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {userId} = this.props;
		return (
			<div className="col-30 right">
				{userId ?
					<div className="send-message-button icon-wrapper">
						<span className="icon-message" onClick={this.handleMessage}></span>
					</div>
					: ''}
			</div>
		);
	}

	handleMessage() {
		this.context.history.pushState(null, `/conversations/${this.props.userId}`);
	}
}