import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ErrorMessage.scss';

export default class ErrorMessage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            display: 'block'
        };
    }

    static propTypes = {
        text: PropTypes.string.isRequired
    };

    handleClickCancel() {
        this.setState({display: 'none'});
    }

    render() {
        const {text} = this.props;
        const {display} = this.state;

        return (
            <div className={styles.errorMessageWrapper} style={{display: display}}>
                <div className={'small ' + styles.errorMessage}>
                    <div className={styles.message}>{text}</div>
                    <div className={'icon icon-x ' + styles.crossIcon} onClick={this.handleClickCancel.bind(this)}/>
                </div>
            </div>
        );
    }
}