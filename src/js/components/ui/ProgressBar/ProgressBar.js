import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProgressBar.scss';
var Line = require('rc-progress').Line;
import {Motion, spring} from 'react-motion';

export default class ProgressBar extends Component {

    static propTypes = {
        title          : PropTypes.string,
        percentage     : PropTypes.number,
        size           : PropTypes.oneOf(['small', 'large']).isRequired,
        onClickHandler : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            prevPercentage: 0,
            percentage    : props.percentage
        }
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
        const {title, size} = this.props;
        const {prevPercentage, percentage} = this.state;

        return (
            <div className={styles.progressBarWrapper + ' ' + styles[size]} onClick={this.handleClick.bind(this)}>
                <div className={styles.title}>{title}</div>
                <div className={styles.progressBar}>
                    <div className={styles.line}>
                        <Motion
                            defaultStyle={{progress: prevPercentage}}
                            style={{progress: spring(percentage)}}
                        >
                            {val => <Line percent={val.progress} strokeWidth={size === 'small' ? "4" : "2"} trailWidth={size === 'small' ? "4" : "2"} strokeColor="#555"/>}
                        </Motion>
                    </div>
                    <div className={styles.percentage}>
                        {percentage || 0}%
                    </div>
                </div>
            </div>
        );
    }
}