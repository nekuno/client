import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './NetworkLine.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";

export default class NetworkLine extends Component {

    static propTypes = {
        network: PropTypes.string.isRequired
    };

    renderIcon() {
        let network = this.props.network;
        network = network === 'google' ? 'youtube' : network;

        return <RoundedIcon icon={network} size={'small'}/>;
    };

    renderName() {
        return this.props.network.toLowerCase();
    }

    render() {
        return (
            <div className={styles.networkLine}>
                <div className={styles.networkIcon}>
                    {this.renderIcon()}
                </div>
                <div className={styles.networkName}>
                    {this.renderName()}
                </div>
            </div>

        );
    }
}