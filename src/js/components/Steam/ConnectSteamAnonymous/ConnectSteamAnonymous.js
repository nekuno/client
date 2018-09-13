import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {SOCIAL_NETWORKS_NAMES, STEAM_API_KEY} from '../../../constants/Constants';
import SocialNetworkService from '../../../services/SocialNetworkService';
import request from 'request';
import translate from '../../../i18n/Translate';
import Frame from '../../ui/Frame/Frame.js';
import RoundedIcon from '../../ui/RoundedIcon/RoundedIcon.js';
import styles from './ConnectSteamAnonymous.scss';

@translate('ConnectSteamAnonymous')
export default class ConnectSteamAnonymous extends Component {

    static propTypes = {
        addGame   : PropTypes.func.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);

        this.state = {
            isLoading: false,
            isLoaded: false
        }
    }

    onClick() {
        const { strings } = this.props;
        const resource = SOCIAL_NETWORKS_NAMES.STEAM;
        this.setState({isLoading: true});
        SocialNetworkService.login(resource).then(() => {
            const openId = SocialNetworkService.getResourceId(resource);
            const url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + STEAM_API_KEY + "&steamid=" + openId + "&format=json&include_appinfo=1&include_played_free_games=1";

            request(url, (err, response, body) => {
                this.setState({isLoading: false});
                if (err) {
                    return alert(err);
                }
                if (response.statusCode >= 400) {
                    return alert(body);
                }

                const data = JSON.parse(body);
                console.log(data)
                if (data.response && data.response.games && data.response.game_count > 0) {
                    this.setState({isLoaded: true});
                    data.response.games.forEach(game => {
                        if (game.appid) {
                            const gameId = game.appid;
                            // const gameUrl = "https://store.steampowered.com/app/" + gameId;
                            // const name = game.name;
                            // let image = null;
                            // if (game.img_logo_url) {
                            //     image = "http://media.steampowered.com/steamcommunity/public/images/apps/" + gameId + "/" + game.img_logo_url + ".jpg"
                            // }

                            const gameData = {
                                id: gameId,
                                name: game.name,
                                gameUrl: "https://store.steampowered.com/app/" + gameId,
                                imageUrl: game.img_logo_url ? "http://media.steampowered.com/steamcommunity/public/images/apps/" + gameId + "/" + game.img_logo_url + ".jpg" : null
                            };


                            this.props.addGame(game.name)


                        }
                    })
                } else {
                    alert(strings.cannotGetGames)
                }
            });
        });

    }

    render() {
        const { strings } = this.props;
        const { isLoading, isLoaded } = this.state;

        return(
            <div className={styles.connectSteamAccountAnonymous}>
                {isLoading ?
                    ''
                    : isLoaded ? '' :
                    <Frame onClickHandler={this.onClick}>
                        <div className={styles.steamIcon}>
                            <RoundedIcon icon={'steam'} size={'medium'} background={'#367195'}/>
                        </div>
                        <div className={styles.textWrapper}>
                            <div className={styles.title + ' small'}>{strings.connect}</div>
                            <div className={styles.resume + ' small'}>{strings.resume}</div>
                        </div>
                    </Frame>
                }
            </div>
        );
    }
}

ConnectSteamAnonymous.defaultProps = {
    strings  : {
        connect       : 'Connect Steam',
        resume        : 'Load your favorite games automatically',
        cannotGetGames: 'You may have privacy settings to private. Try to set to public if you want to see your games.'
    },
};