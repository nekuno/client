import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './TopBar.scss';

export default class TopBar extends Component {

    static propTypes = {
        position  : PropTypes.oneOf(['sticky', 'absolute']),
        background: PropTypes.string,
        color     : PropTypes.string,
        textAlign : PropTypes.oneOf(['center', 'left']),
        boxShadow : PropTypes.bool
    };

    render() {
        const {textAlign, children} = this.props;
        let {position, background, color, boxShadow} = this.props;
        let className = textAlign === 'left' ? styles.topBar + ' ' + styles.left : styles.topBar;
        className = boxShadow ? className + ' ' + styles.boxShadow : className;
        position = position ? position : 'sticky';
        background = background ? background : 'white';
        color = color ? color : '#2B3857';

        return (
            <div className={className} style={{position: position, background: background, color: color}}>
                {children}
            </div>
        );
    }
}