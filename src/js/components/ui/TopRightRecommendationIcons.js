import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as ThreadActionCreators from '../../actions/ThreadActionCreators';

export default class TopRightRecommendationIcons extends Component {

	static propTypes = {
		thread: PropTypes.object
	};

	static contextTypes = {
		history: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		this.deleteThread = this.deleteThread.bind(this);
		this.editThread = this.editThread.bind(this);
	}
	shouldComponentUpdate = shouldPureComponentUpdate;

	deleteThread() {
		const threadId = this.props.thread.id;
		const history = this.context.history;
		ThreadActionCreators.deleteThread(threadId)
		.then(function(){
			history.pushState(null, '/threads');
		});
	}

	editThread() {
		this.context.history.pushState(null, `edit-thread/${this.props.thread.id}`);
	}

	render() {
		return (
			<div className="col-30 right">
				<div onClick={this.editThread}className="icon-wrapper">
					{/* TODO: Link to Edit Threads */}
					<span className="icon-edit">
					</span>
				</div>
				<div onClick={this.deleteThread} className="icon-wrapper">
					<span className="icon-delete">
					</span>
				</div>
			</div>
		);
	}
}