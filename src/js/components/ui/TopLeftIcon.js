import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopLeftIcon extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};
	static propTypes = {
		text: PropTypes.string
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-25 left">
				<span className={'icon-' + this.props.icon} onClick={() => this.context.history.goBack()}>

				</span>
			</div>
		);
	}
}
