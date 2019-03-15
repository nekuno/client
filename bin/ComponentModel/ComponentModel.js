import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ComponentModel.scss';

export default class ComponentModel extends Component {

    static propTypes = {
        onClickHandler : PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {children} = this.props;

        return (
            <div className={styles.componentModel} onClick={this.handleClick.bind(this)}>
                {children}
            </div>
        );
    }
}