import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import * as ThreadActionCreators from '../../actions/ThreadActionCreators';

export default class TopRightUserIcons extends Component {

	static propTypes = {
		thread: PropTypes.object
	};

	static contextTypes = {
		history: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		this.editProfile = this.editProfile.bind(this);
	}
	shouldComponentUpdate = shouldPureComponentUpdate;

	editProfile() {
		this.context.history.pushState(null, `edit-profile`);
	}

	render() {
		return (
			<div className="col-30 right">
				<div onClick={this.editProfile} className="icon-wrapper">
					<span className="icon-edit">
					</span>
				</div>
			</div>
		);
	}
}