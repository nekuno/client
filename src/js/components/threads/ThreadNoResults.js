import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';
import Button from '../ui/Button';
import * as ThreadActionCreators from '../../actions/ThreadActionCreators';

@translate('ThreadNoResults')
export default class ThreadNoResults extends Component {
    static propTypes = {
        threadId: PropTypes.number.isRequired,
        deleting: PropTypes.bool,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.onEdit = this.onEdit.bind(this);

        this.state = {
            deleting: null
        };
    }

    onEdit() {
        this.context.router.push(`edit-thread/${this.props.threadId}`)
    }

    onDelete() {
        const {threadId} = this.props;
        ThreadActionCreators.deleteThread(threadId);
    }

    render() {
        const {threadId, deleting, strings} = this.props;
        const deleteText = deleting ? strings.deleting : strings.delete;
        return (
            <div key={threadId} className="no-results-thread">
                <div className="sub-title">{strings.emptyThread}</div>
                <div className="no-results-thread-buttons">
                    <Button onClick={this.onEdit} disabled={deleting ? 'disabled' : null}>{strings.edit}</Button>
                    <Button onClick={this.onDelete} disabled={deleting ? 'disabled' : null}>{deleteText}</Button>
                </div>
            </div>
        );
    }
}

ThreadNoResults.defaultProps = {
    strings: {
        emptyThread: 'This yarn is empty. Edit or delete it.',
        edit       : 'Edit',
        delete     : 'Delete',
        deleting   : 'Deleting'
    }
};
