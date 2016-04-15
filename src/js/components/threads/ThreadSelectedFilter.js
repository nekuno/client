import React, { PropTypes, Component } from 'react';

export default class ThreadSelectedFilter extends Component {
    static propTypes = {
        children: PropTypes.object,
        type: PropTypes.string.isRequired,
        active: PropTypes.bool,
        plusIcon: PropTypes.bool,
        handleClickRemoveFilter: PropTypes.func.isRequired
    };

    render() {
        const {type, active, plusIcon, children} = this.props;
        let iconClass = plusIcon ? 'icon-plus' : active ? 'icon-circle active' : 'icon-circle';
        return(
            <div className={'thread-filter ' + type + '-filter'}>
                <div className="users-middle-vertical-line"></div>
                {this.renderSelectedFilterBackground()}
                <div className="thread-filter-dot">
                    <span className={iconClass}></span>
                </div>
                {children}
                {this.renderSelectedFilterOppositeBackground()}
                <div className="table-row"></div>
            </div>
        );
    }

    renderSelectedFilterBackground() {
        return (
            <div className="thread-filter-background">
                <div className="thread-filter-remove" onClick={this.handleClickRemoveFilter}>
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