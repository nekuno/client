import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';

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
        return(
            <div className={className}>
                <div style={{position: 'absolute', right: '48px', marginTop: '-6px'}}>
                    <RoundedIcon icon={'delete'} size={'small'} disabled={cantRemove} fontSize={'16px'} onClickHandler={this.handleClickRemoveFilter.bind(this)}/>
                </div>
                {children}
            </div>
        );
    }

    handleClickRemoveFilter() {
        this.props.handleClickRemoveFilter();
    }
}