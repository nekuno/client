import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import { SOCIAL_NETWORKS } from '../../constants/Constants';
import EmptyMessage from "./EmptyMessage/EmptyMessage";

@translate('SocialBox')
export default class SocialBox extends Component {

    static propTypes = {
        excludedResources: PropTypes.array,
        onClickHandler   : PropTypes.func,
        disabled         : PropTypes.bool,
        disabledButtons  : PropTypes.bool,
    };

    constructor() {
        super();

        this.handleClickResourceOwner = this.handleClickResourceOwner.bind(this);
    }

    handleClickResourceOwner(resource, scope) {
        if (!this.props.disabled) {
            this.props.onClickHandler(resource, scope);
        }
    }

    render() {
        const {excludedResources, disabled, disabledButtons} = this.props;
        const className = disabled ? "social-box social-box-disabled" : "social-box";
        return (
            <div>
                <div className={className}>
                    {SOCIAL_NETWORKS.map((socialNetwork, index) =>
                        !excludedResources || !excludedResources.some(resource => resource === socialNetwork.resourceOwner) ?
                            <div key={index} className={disabledButtons ? 'disabled' : ''}>
                                <a onClick={this.handleClickResourceOwner.bind(this, socialNetwork.resourceOwner, socialNetwork.scope)}>
                                    <span className={socialNetwork.resourceOwner === 'google' ? 'icon-youtube' : 'icon-' + socialNetwork.resourceOwner}></span>
                                </a>
                            </div>
                            : null
                    )}

                </div>
            </div>

        );
    }
}

SocialBox.defaultProps = {
    'disabled': false,
    strings   : {
        'isLoading': 'Getting information'
    }
};