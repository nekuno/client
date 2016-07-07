import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS } from '../../constants/Constants';

export default class SocialBox extends Component {

    static propTypes = {
        excludedResources: PropTypes.array,
        onClickHandler   : PropTypes.func
    };

    handleClickResourceOwner(resource, scope) {
        this.props.onClickHandler(resource, scope);
    }

    render() {
        const {excludedResources} = this.props;
        return (
            <div className="social-box">
                {SOCIAL_NETWORKS.map((socialNetwork, index) =>
                    !excludedResources || !excludedResources.some(resource => resource == socialNetwork.resourceOwner) ?
                        <div key={index}>
                            <a onClick={this.handleClickResourceOwner.bind(this, socialNetwork.resourceOwner, socialNetwork.scope)}>
                                <span className={socialNetwork.resourceOwner == 'google' ? 'icon-youtube' : 'icon-' + socialNetwork.resourceOwner}></span>
                            </a>
                        </div>
                        : null
                )}
            </div>
        );
    }
}