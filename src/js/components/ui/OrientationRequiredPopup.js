import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextRadios from './TextRadios';
import FullWidthButton from './FullWidthButton';
import EmptyMessage from './EmptyMessage';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const metadata = ProfileStore.getMetadata();

    return {
        metadata,
    };
}

@translate('OrientationRequiredPopup')
@connectToStores([ProfileStore], getState)
export default class OrientationRequiredPopup extends Component {
    static propTypes = {
        profile   : PropTypes.object,
        onContinue: PropTypes.func,
        onClick   : PropTypes.func,
        onCancel  : PropTypes.func,
        metadata  : PropTypes.object,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onSelect(key) {
        this.props.onClick();
        nekunoApp.closeModal('.popup-orientation-required');
        let profile = {orientation: [key]};
        for (key in this.props.profile) {
            if (this.props.profile.hasOwnProperty(key)) {
                profile[key] = this.props.profile[key];
            }
        }
        UserActionCreators.editProfile(profile)
            .then(() => {
                this.props.onContinue();
            }, () => {
                console.log('error editing profile')
            });
    }

    onCancel() {
        nekunoApp.closeModal('.popup-orientation-required');
        this.props.onCancel();
    }

    getLabels(metadata) {
        let labels = [];
        if (metadata && metadata.orientation) {
            Object.keys(metadata.orientation.choices).forEach((index) => {
                labels.push({
                    key: index,
                    text: metadata.orientation.choices[index]
                });
            });
        }

        return labels;
    }

    render() {
        const {metadata, strings} = this.props;
        const popupClass = 'popup popup-orientation-required tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-orientation-required-title title">{strings.orientationRequired}</div>

                    {metadata ?
                        <div>
                            <TextRadios title={strings.title} labels={this.getLabels(metadata)} onClickHandler={this.onSelect} forceTwoLines={true}/>
                            <FullWidthButton onClick={this.onCancel}> {strings.cancel} </FullWidthButton>
                        </div>
                        :
                        <EmptyMessage text={''} loadingGif={true}/>
                    }

                </div>
            </div>
        );
    }
}

OrientationRequiredPopup.defaultProps = {
    strings   : {
        title              : 'Select your sexual orientation sexual to see this yarn',
        orientationRequired: 'Orientation required',
        cancel             : 'Cancel'
    },
    onClick   : () => {
    },
    onContinue: () => {
    },
    onCancel  : () => {
    }
};