import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProgressBar.scss';
var Line = require('rc-progress').Line;
import {Motion, spring} from 'react-motion';

export default class ProgressBar extends Component {

    static propTypes = {
        title          : PropTypes.string,
        percentage     : PropTypes.number,
        textColor      : PropTypes.string,
        size           : PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
        strokeColor    : PropTypes.string,
        trailColor     : PropTypes.string,
        background     : PropTypes.string,
        withoutNumber  : PropTypes.bool,
        onClickHandler : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            prevPercentage: 0,
            percentage    : props.percentage
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.percentage !== nextProps.percentage;
    }

    componentDidUpdate(prevProps) {
        this.setState({
            prevPercentage: prevProps.percentage,
            percentage    : this.props.percentage,
        });
    }

    handleClick() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }

    render() {
        const {title, size, withoutNumber, strokeColor, trailColor, background, textColor} = this.props;
        const {prevPercentage, percentage} = this.state;
        const lineWidth = size === "small" ? "5" : size === "medium" ? "3" : "2";

        return (
            <div className={styles.progressBarWrapper + ' ' + styles[size]} style={background ? {background: background} : {}} onClick={this.handleClick.bind(this)}>
                <div className={styles.title}>{title}</div>
                <div className={styles.progressBar}>
                    <div className={withoutNumber ? styles.line + ' ' + styles.withoutNumber : styles.line}>
                        <Motion
                            defaultStyle={{progress: prevPercentage}}
                            style={{progress: spring(percentage)}}
                        >
                            {val => <Line percent={val.progress} strokeWidth={lineWidth} trailWidth={lineWidth} strokeColor={strokeColor || "#555"} trailColor={trailColor || "#D9D9D9"}/>}
                        </Motion>
                    </div>
                    {!withoutNumber ?
                        <div className={styles.percentage} style={textColor ? {color: textColor} : {}}>
                            {percentage || 0}%
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}