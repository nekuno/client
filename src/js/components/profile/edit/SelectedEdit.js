import React, { PropTypes, Component } from 'react';

export default class SelectedEdit extends Component {
    static propTypes = {
        children: PropTypes.object,
        type: PropTypes.string.isRequired,
        addedClass: PropTypes.string,
        active: PropTypes.bool,
        plusIcon: PropTypes.bool,
        handleClickRemoveFilter: PropTypes.func.isRequired
    };
    
    getSelectedFilter() {
        return this.refs.selectedFilter;
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.contains(target);
    }
    
    render() {
        const {type, addedClass, children} = this.props;
        const className = addedClass ? addedClass + ' thread-filter ' + type + '-filter' : 'thread-filter ' + type + '-filter';
        return(
            <div className={className} ref={'selectedFilter'}>
                {this.renderSelectedFilterBackground()}
                {children}
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedFilterBackground() {
        return (
            <div className="thread-filter-background">
                <div className="thread-filter-remove" onClick={this.handleClickRemoveFilter.bind(this)}>
                    <div className="small-icon-wrapper">
                        <span className="icon-delete"></span>
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedFilterOppositeBackground = function() {
        return (
            <div className="thread-filter-opposite-background"></div>
        );
    };

    handleClickRemoveFilter() {
        this.props.handleClickRemoveFilter();
    }
}