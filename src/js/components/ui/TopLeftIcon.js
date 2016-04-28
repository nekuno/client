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
			<div className="col-30 left" onClick={() => this.context.history.goBack()}>
				<span className={'icon-' + icon}></span>
			</div>
		);
	}
}
