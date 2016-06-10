import React, { PropTypes, Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import ChatThreadStore from '../../stores/ChatThreadStore';

function getState() {
	const hasUnread = ChatThreadStore.hasUnread() || false;

	return {
		hasUnread
	};
}

@connectToStores([ChatThreadStore], getState)
export default class TopLeftMenuLink extends Component {
	static propTypes = {
		hasUnread: PropTypes.bool
	};
	
	render() {
		return (
			<div className="col-30 left">
				<a className="open-panel">
					<span className="icon-menu"></span>
					{this.props.hasUnread ?
						<span className="icon-circle"></span> : ''
					}
				</a>
			</div>
		);
	}
}
