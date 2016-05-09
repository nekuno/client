import React, { PropTypes, Component } from 'react';

export default class SelectedEdit extends Component {
    static propTypes = {
        children: PropTypes.object,
        type: PropTypes.string.isRequired,
        addedClass: PropTypes.string,
        active: PropTypes.bool,
        plusIcon: PropTypes.bool,
        handleClickRemoveEdit: PropTypes.func.isRequired
    };
    
    getSelectedEdit() {
        return this.refs.selectedEdit;
    }

    selectedEditContains(target) {
        return this.refs.selectedEdit.contains(target);
    }
    
    render() {
        const {type, addedClass, children} = this.props;
        const className = addedClass ? addedClass + ' thread-filter ' + type + '-filter' : 'thread-filter ' + type + '-filter';
        return(
            <div className={className} ref={'selectedEdit'}>
                {this.renderSelectedEditBackground()}
                {children}
                {this.renderSelectedEditOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedEditBackground() {
        return (
            <div className="thread-filter-background">
                <div className="thread-filter-remove" onClick={this.handleClickRemoveEdit.bind(this)}>
                    <div className="small-icon-wrapper">
                        <span className="icon-delete"></span>
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedEditOppositeBackground = function() {
        return (
            <div className="thread-filter-opposite-background"></div>
        );
    };

    handleClickRemoveEdit() {
        this.props.handleClickRemoveEdit();
    }
}