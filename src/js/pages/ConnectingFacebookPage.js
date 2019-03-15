import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import RoundedImage from '../components/ui/RoundedImage/RoundedImage.js';
import RoundedIcon from '../components/ui/RoundedIcon/RoundedIcon.js';
import ProgressBar from '../components/ui/ProgressBar/ProgressBar.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/connecting-facebook.scss';


function getState(props) {

    const networks = WorkersStore.getAll();
    const facebookNetwork = networks.find(network => network.resource === SOCIAL_NETWORKS_NAMES.FACEBOOK);
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();

    return {
        facebookNetwork,
        error,
        isLoading,
    };
}

@AuthenticatedComponent
@translate('ConnectingFacebookPage')
@connectToStores([WorkersStore], getState)
export default class ConnectingFacebookPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        facebookNetwork: PropTypes.object.isRequired,
        error    : PropTypes.bool,
        isLoading: PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToProposals = this.goToProposals.bind(this);
    }

    componentDidMount() {
        setTimeout(this.goToProposals, 5000);
    }

    goToProposals() {
        this.context.router.push('/proposals');
    }

    render() {
        const {user, facebookNetwork, strings} = this.props;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';
        const username = user && user.username ? user.username : '';

        return (
            <div className="views">
                <div className="view view-main connecting-facebook-view">
                    <TopNavBar background={'transparent'} color={'white'} textCenter={strings.analyzing} position={'absolute'} textSize={'small'}/>
                    <div className="connecting-facebook-wrapper">
                        <Overlay/>
                        <h1>{strings.title.replace('%username%', username)}</h1>
                        <h2>{strings.description}</h2>
                        <div className="first-image-wrapper">
                            <div className="second-image-wrapper">
                                <div className="third-image-wrapper">
                                    <div className="last-image-wrapper">
                                        <RoundedImage size={'medium'} url={imgSrc}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="analyzing-data">
                            <div className="analyzing-data-title">
                                <RoundedIcon icon="facebook" size="small" background="white" color="#756EE5"/>
                                <div className="analyzing-data-text">{strings.analyzing}</div>
                            </div>
                            <ProgressBar
                                size={'large'}
                                percentage={facebookNetwork.process || 0}
                                withoutNumber={true}
                                background={"transparent"}
                                strokeColor={"white"}
                                trailColor={"rgba(255, 255, 255, 0.1)"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

ConnectingFacebookPage.defaultProps = {
    strings: {
        analyzing  : 'Analyzing data',
        title      : 'Hello %username%!',
        description: 'You are already part of Nekuno',
    }
};