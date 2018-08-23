import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './TopBar.scss';

export default class TopBar extends Component {

    static propTypes = {
        position  : PropTypes.oneOf(['relative', 'absolute']),
        background: PropTypes.string,
        textAlign : PropTypes.oneOf(['center', 'left']),
    };

    render() {
        const {textAlign, children} = this.props;
        let {position, background} = this.props;
        const className = textAlign === 'left' ? styles.topBar + ' ' + styles.left : styles.topBar;
        position = position ? position : 'relative';
        background = background ? background : '#FBFCFD';

        return (
            <div className={className} style={{position: position, background: background}}>
                {children}
            </div>
        );
    }
}