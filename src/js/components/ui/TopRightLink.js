import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightLink extends Component {
	static propTypes = {
		text: PropTypes.string,
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {text, onClickHandler} = this.props;
		return (
			<div className="col-30 right">
				<a onClick={onClickHandler}>
					{text}
				</a>
			</div>
		);
	}
}