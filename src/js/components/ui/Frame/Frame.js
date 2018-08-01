import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Frame.scss';

export default class Frame extends Component {

    static propTypes = {
        title         : PropTypes.string,
        onClickHandler: PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {title, children} = this.props;

        return (
            <div className={styles.frame} onClick={this.handleClick.bind(this)}>
                {title ?
                    <div className={styles.title}>{title}</div>
                    : null
                }
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        );
    }
}