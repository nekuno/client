import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './NetworkInformation.scss';
import translate from '../../../i18n/Translate';
import RoundedIcon from "../RoundedIcon/RoundedIcon";
import ContentTypeIcon from "../ContentTypeIcon/ContentTypeIcon";

@translate('NetworkInformation')
export default class NetworkInformation extends Component {

    static propTypes = {
        network: PropTypes.string.isRequired,
        data   : PropTypes.object, //[{type: amount},{type: amount}, ...]
    };

    constructor(props) {
        super(props);

        this.getIcons = this.getIcons.bind(this);
        this.getNetworkColor = this.getNetworkColor.bind(this);
    }

    getIcons() {
        const {data} = this.props;

        return Object.keys(data).map(type => {
            return <div key={type} className={styles.datum}>
                <div className={styles.typeIcon}><ContentTypeIcon type={type}/></div>
                <div className={styles.typeAmount}> {data[type]} </div>
            </div>
        });
    }

    getNetworkColor() {
        const {network} = this.props;

        let color;

        switch (network) {
            case 'facebook':
                color = '#3b5998';
                break;
            case 'twitter':
                color = '#43b6f2';
                break;
            case 'linkedin':
                color = '#0077b5';
                break;
            case 'google':
                color = '#c4302b';
                break;
            case 'spotify':
                color = '#7ad768';
                break;
            case 'tumblr':
                color = '#395976';
                break;
            case 'steam':
                color = '#367195';
                break;
            default:
                color = 'white';
                break;
        }

        return color;
    }

    render() {
        const {strings, network} = this.props;
        const iconNetwork = network === 'google' ? 'youtube' : network;

        return (
            <div className={styles.networkInformation}>
                <div className={styles.topLine}>
                    <div className={styles.networkIcon}><RoundedIcon icon={iconNetwork} size={'small'} background={this.getNetworkColor()}/></div>
                    <div className={styles.networkText}>{network}</div>
                </div>
                <div className={styles.middleLine}> {strings.middleText}</div>
                <div className={styles.bottomLine}>{this.getIcons()}</div>
            </div>
        );
    }
}