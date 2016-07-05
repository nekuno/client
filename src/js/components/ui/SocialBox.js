import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS } from '../../constants/Constants';

export default class SocialBox extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func
    };

    handleClickResourceOwner(resource, scope) {
        this.props.onClickHandler(resource, scope);
    }

    render() {
        return (
            <div className="social-box">
                {SOCIAL_NETWORKS.map((socialNetwork, index) =>
                    <div key={index}>
                        <a onClick={this.handleClickResourceOwner.bind(this, socialNetwork.resourceOwner, socialNetwork.scope)}>
                            <span className={socialNetwork.resourceOwner == 'google' ? 'icon-youtube' : 'icon-' + socialNetwork.resourceOwner}></span>
                        </a>
                    </div>
                )}
            </div>
        );
    }
}