import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Banner.scss';

export default class Banner extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func.isRequired,
        onSkipHandler : PropTypes.func.isRequired,
        title         : PropTypes.string.isRequired,
        description   : PropTypes.string.isRequired,
        buttonText    : PropTypes.string.isRequired,
        skipText      : PropTypes.string.isRequired,
        icon          : PropTypes.string
    };

    handleClick() {
        this.props.onClickHandler();
    }

    handleSkip() {
        this.props.onSkipHandler();
    }

    render() {
        const {title, description, buttonText, skipText, icon} = this.props;

        return (
            <div className={styles.banner}>
                <div className={styles.textWrapper} onClick={this.handleClick.bind(this)}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </div>
                {icon ?
                    <span className={styles.icon + ' icon icon-' + icon} onClick={this.handleClick.bind(this)}/>
                    : null
                }
                <div className={styles.buttonWrapper} onClick={this.handleClick.bind(this)}>
                    <div className={styles.button}>{buttonText}</div>
                </div>
                <div className={styles.skipLink} onClick={this.handleSkip.bind(this)}>{skipText}</div>
            </div>
        );
    }
}