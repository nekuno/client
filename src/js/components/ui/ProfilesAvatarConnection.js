import React, { PropTypes, Component } from 'react';

export default class ProfilesAvatarConnection extends Component {
	static propTypes = {
		ownPicture: PropTypes.string.isRequired,
		otherPicture: PropTypes.string.isRequired
	};

	render() {
		return (
			<div className = "profile-avatars-connection">
				<div className = "small-user-image">
					<img src={this.props.otherPicture}/>
				</div>
				<div className = "small-user-circles">
					<span className="icon-circle"></span>
					<span className="icon-circle"></span>
					<span className="icon-circle"></span>
				</div>
				<div className = "small-user-image">
					<img src={this.props.ownPicture}/>
				</div>
			</div>
		);
	}
}