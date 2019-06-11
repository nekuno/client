import PropTypes from 'prop-types';
import React, { Component } from 'react';
import connectToStores from '../../utils/connectToStores';
import ChatThreadStore from '../../stores/ChatThreadStore';
import Icon from './Icon';

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
					<span id="joyride-3-menu" className="icon-menu"></span>
					{this.props.hasUnread ?
						<Icon icon="circle" /> : ''
					}
				</a>
			</div>
		);
	}
}
