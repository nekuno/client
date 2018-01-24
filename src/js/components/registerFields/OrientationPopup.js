import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginActionCreators from '../../actions/LoginActionCreators';
import TextRadios from '../ui/TextRadios';
import FullWidthButton from '../ui/FullWidthButton';
import EmptyMessage from '../ui/EmptyMessage';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ProfileStore from '../../stores/ProfileStore';
import Framework7Service from '../../services/Framework7Service';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const metadata = ProfileStore.getMetadata();

    return {
        metadata,
    };
}

@translate('OrientationPopup')
@connectToStores([ProfileStore], getState)
export default class OrientationPopup extends Component {
    static propTypes = {
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
        Framework7Service.nekunoApp().closeModal('.popup-orientation');
        let profile = {
            orientation: [key],
            mode: 'contact'
        };

        LoginActionCreators.preRegisterProfile(profile);
        this.props.onContinue();
    }

    onCancel() {
        Framework7Service.nekunoApp().closeModal('.popup-orientation');
        this.props.onCancel();
    }

    getLabels(metadata) {
        let labels = [];
        if (metadata && metadata.orientation) {
            Object.keys(metadata.orientation.choices).forEach((index) => {
                labels.push({
                    key : index,
                    text: metadata.orientation.choices[index]
                });
            });
        }

        return labels;
    }

    render() {
        const {metadata, strings} = this.props;
        const popupClass = 'popup popup-orientation tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
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

OrientationPopup.defaultProps = {
    strings   : {
        orientation: 'Sexual orientation',
        cancel     : 'Cancel'
    },
    onClick   : () => {
    },
    onContinue: () => {
    },
    onCancel  : () => {
    }
};