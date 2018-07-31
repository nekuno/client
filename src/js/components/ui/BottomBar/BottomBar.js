import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './BottomBar.scss';

export default class BottomBar extends Component {

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
            <div className={styles.bottomBar} onClick={this.handleClick.bind(this)}>
                {children}
            </div>
        );
    }
}