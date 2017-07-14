import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ThreadSelectedFilter extends Component {
    static propTypes = {
        children: PropTypes.object,
        type: PropTypes.string.isRequired,
        addedClass: PropTypes.string,
        active: PropTypes.bool,
        plusIcon: PropTypes.bool,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        cantRemove: PropTypes.bool
    };
    
    render() {
        const {type, addedClass, active, plusIcon, children, cantRemove} = this.props;
        const className = addedClass ? addedClass + ' thread-filter ' + type + '-filter' : 'thread-filter ' + type + '-filter';
        let iconClass = plusIcon ? 'icon-plus' : active ? 'icon-circle active' : 'icon-circle';
        return(
            <div className={className}>
                <div className="persons-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground(cantRemove)}
                <div className="thread-filter-dot">
                    <span className={iconClass}></span>
                </div>
                {children}
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedFilterBackground(cantRemove) {
        return (
            <div className="thread-filter-background">
                {cantRemove ? null :
                    <div className="thread-filter-remove" onClick={this.handleClickRemoveFilter.bind(this)}>
                        <div className="small-icon-wrapper">
                            <span className="icon-delete"></span>
                        </div>
                    </div>
                }
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