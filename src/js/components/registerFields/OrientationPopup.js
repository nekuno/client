import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginActionCreators from '../../actions/LoginActionCreators';
import TextRadios from '../ui/TextRadios';
import FullWidthButton from '../ui/FullWidthButton';
import EmptyMessage from '../ui/EmptyMessage';
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

@translate('OrientationPopup')
@connectToStores([ProfileStore], getState)
export default class OrientationPopup extends Component {
    static propTypes = {
        onContinue: PropTypes.func,
        onCancel  : PropTypes.func,
        metadata  : PropTypes.object,
        contentRef: PropTypes.func,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onSelect(key) {
        this.props.onCancel();
        let profile = {
            orientation: [key],
            mode: 'contact'
        };

        LoginActionCreators.preRegisterProfile(profile);
        this.props.onContinue();
    }

    onCancel() {
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
        const {metadata, contentRef, strings} = this.props;
        const popupClass = 'popup popup-orientation tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div ref={contentRef} className="content-block">
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
        title : 'Sexual orientation',
        cancel: 'Cancel'
    },
    onCancel   : () => {
    },
    onContinue: () => {
    }
};