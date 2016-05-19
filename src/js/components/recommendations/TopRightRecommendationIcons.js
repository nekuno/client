import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import * as ThreadActionCreators from '../../actions/ThreadActionCreators';
import translate from '../../i18n/Translate';

@translate('TopRightRecommendationIcons')
export default class TopRightRecommendationIcons extends Component {

    static propTypes = {
        thread : PropTypes.object,
        // Injected by @translate:
        strings: PropTypes.object
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
        nekunoApp.confirm(this.props.strings.confirmDelete, () => {
            const threadId = this.props.thread.id;
            const history = this.context.history;
            ThreadActionCreators.deleteThread(threadId)
                .then(function() {
                    history.pushState(null, '/threads');
                });
        });
    }

    editThread() {
        this.context.history.pushState(null, `edit-thread/${this.props.thread.id}`);
    }

    render() {
        return (
            <div className="col-30 right">
                <div onClick={this.editThread} className="icon-wrapper">
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

TopRightRecommendationIcons.defaultProps = {
    strings: {
        confirmDelete: 'Are you sure you want to delete this thread?'
    }
};