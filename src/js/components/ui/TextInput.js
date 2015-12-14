import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TextInput extends Component {
	static propTypes = {
		placeholder: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<li>
				<div className="item-content">
					<div className="item-inner">
						<div className="item-input">
							<input type="text" placeholder={this.props.placeholder} defaultValue={this.props.value} />
						</div>
					</div>
				</div>
			</li>
		);
	}
}