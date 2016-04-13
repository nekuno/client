import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopLeftLink extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired
	};
	static propTypes = {
		text: PropTypes.string,
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {onClickHandler, text} = this.props;
		return (
			<div className="col-30 left">
				<a onClick={typeof onClickHandler !== 'undefined' ? onClickHandler : this.context.history.goBack}>
					{text}
				</a>
			</div>
		);
	}
}
