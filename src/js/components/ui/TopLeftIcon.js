import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopLeftIcon extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};
	static propTypes = {
		icon: PropTypes.string
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {icon} = this.props;
		return (
			<div className="col-30 left">
				<span className={'icon-' + icon} onClick={() => this.context.history.goBack()}></span>
			</div>
		);
	}
}
