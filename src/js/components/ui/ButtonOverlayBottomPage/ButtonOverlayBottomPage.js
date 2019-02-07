import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ButtonOverlayBottomPage.scss';

export default class ButtonOverlayBottomPage extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        text          : PropTypes.string,
    };

    render() {
        const {text, onClickHandler} = this.props;

        return (
            <div className={styles.buttonOverlayBottomPage} onClick={onClickHandler}>
                {text}
            </div>
        );
    }
}

ButtonOverlayBottomPage.defaultProps = {
    onClickHandler: () => {
    },
    text          : ''
};