import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import RouterActionCreators from '../../actions/RouterActionCreators';

export default class TopLeftLink extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		text		  : PropTypes.string,
		icon		  : PropTypes.string,
		onClickHandler: PropTypes.func,
		wrapIcon      : PropTypes.bool
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	constructor(props) {
		super(props);

		this.goBack = this.goBack.bind(this);
	}

	goBack() {
		RouterActionCreators.previousRoute(this.context.router.getCurrentLocation().pathname);
	}

	render() {
		const {onClickHandler, text, icon, wrapIcon} = this.props;
		return (
			<div className="col-30 left" onClick={typeof onClickHandler !== 'undefined' ? onClickHandler : this.goBack}>
				{icon ?
                    wrapIcon ?
						<div className="icon-wrapper translucent-icon-wrapper">
							<span className={'icon-' + icon}></span>
						</div>
						:
						<span className={'icon-' + icon}></span>
					:
					<a className="navbar-link-text">
						{text}
					</a>
				}
			</div>
		);
	}
}
