import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './RoundedImage.scss';

export default class RoundedImage extends Component {

    static propTypes = {
        url            : PropTypes.string.isRequired,
        size           : PropTypes.oneOf(['x-small', 'small', 'regular', 'large', 'x-large']),
        onClickHandler : PropTypes.func
    };

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {url, size} = this.props;

        return (
            <div className={styles.roundedImage + ' ' + styles[size]} onClick={this.handleClick.bind(this)}>
                <img className={styles.image} src={url} />
            </div>
        );
    }
}