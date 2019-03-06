import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './UnconnectedNetworkCard.scss';
import translate from '../../../i18n/Translate';
import RoundedIcon from "../RoundedIcon/RoundedIcon";
import { SOCIAL_NETWORKS } from "../../../constants/Constants";
import SocialNetworkService from "../../../services/SocialNetworkService";
import ConnectActionCreators from "../../../actions/ConnectActionCreators";
import Framework7Service from "../../../services/Framework7Service";

@translate('UnconnectedNetworkCard')
export default class UnconnectedNetworkCard extends Component {

    static propTypes = {
        network: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.getNetworkColor = this.getNetworkColor.bind(this);
    }

    handleClick() {
        const {network} = this.props;

        const scope = SOCIAL_NETWORKS.some(socialNetwork => socialNetwork.resourceOwner === network).scope;
        SocialNetworkService.login(network, scope, true).then(() => {
            ConnectActionCreators.connect(network, SocialNetworkService.getAccessToken(network), SocialNetworkService.getResourceId(network), SocialNetworkService.getExpireTime(network), SocialNetworkService.getRefreshToken(network));
        }, (status) => {
            Framework7Service.nekunoApp().alert(network + ' login failed: ' + status.error.message);
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
        const {network, strings} = this.props;

        const iconNetwork = network === 'google' ? 'youtube' : network;
        return (
            <div className={styles.unconnectedNetworkCard} onClick={this.handleClick.bind(this)}>
                <div className={styles.icon}><RoundedIcon size={'medium'} icon={iconNetwork} background={this.getNetworkColor()}/></div>
                <div className={styles.text}>
                    <div className={styles.textTitle}>{strings.connect.replace('%network%', network)}</div>
                    <div className={styles.textDescription}>{strings[network]}</div>
                </div>
            </div>
        );
    }
}