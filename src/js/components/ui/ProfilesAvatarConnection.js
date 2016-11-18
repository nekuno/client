import React, { PropTypes, Component } from 'react';
import Image from './Image';

export default class ProfilesAvatarConnection extends Component {
	static propTypes = {
		ownPicture: PropTypes.string,
		otherPicture: PropTypes.string
	};

	render() {
		const defaultSrc = 'img/no-img/small.jpg';
		return (
			<div className = "profile-avatars-connection">
				<div className = "small-user-image">
					<Image src={this.props.otherPicture} defaultSrc={defaultSrc} width="28" height="28"/>
				</div>
				<div className = "small-user-circles">
					<span className="icon-circle"></span>
					<span className="icon-circle"></span>
					<span className="icon-circle"></span>
				</div>
				<div className = "small-user-image">
					<Image src={this.props.ownPicture} defaultSrc={defaultSrc} width="28" height="28"/>
				</div>
			</div>
		);
	}
}
