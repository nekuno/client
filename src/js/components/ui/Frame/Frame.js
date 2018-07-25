import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Frame.scss';

export default class Frame extends Component {

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
            <div className={styles.frame} onClick={this.handleClick.bind(this)}>
                {children}
            </div>
        );
    }
}