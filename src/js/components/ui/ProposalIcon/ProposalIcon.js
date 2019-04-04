import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalIcon.scss';

export default class ProposalIcon extends Component {

    static propTypes = {
        icon          : PropTypes.string,
        size          : PropTypes.oneOf(['xx-small', 'x-small', 'small', 'medium-small', 'medium', 'large', 'answer']).isRequired,
        disabled      : PropTypes.bool,
        background    : PropTypes.string,
        // color         : PropTypes.string,
        // fontSize      : PropTypes.string,
        onClickHandler: PropTypes.func,
        // border        : PropTypes.string,
    };

    handleClick() {
        if (!this.props.disabled && this.props.onClickHandler) {
            this.props.onClickHandler();
        }

    }

    render() {
        const {icon, size, disabled, background} = this.props;
        let className = styles.roundedIcon + ' ' + styles[size];
        className = disabled ? styles.disabled + ' ' + className : className;

        return (

            <div className={className} onClick={this.handleClick.bind(this)} style={{background: background}}>
                <span className={'icon-' + icon}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                    <span className="path6"></span>
                    <span className="path7"></span>
                </span>
            </div>
        );
    }
}