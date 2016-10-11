import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import TextRadios from './TextRadios';
import FullWidthButton from './FullWidthButton';
import translate from '../../i18n/Translate';

@translate('OrientationRequiredPopup')
export default class OrientationRequiredPopup extends Component {
    static propTypes = {
        profile   : PropTypes.object.isRequired,
        onContinue: PropTypes.func.isRequired,
        threadId  : PropTypes.number.isRequired,
        // Injected by @translate:
        strings   : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    render() {
        const {threadId, strings} = this.props;
        const popupClass = 'popup popup-orientation-required-' + threadId + ' tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-orientation-required-title title">{strings.orientationRequired}</div>

                    <TextRadios title={strings.title} labels={[
						{key: 'heterosexual', text: strings.heterosexual},
						{key: 'bisexual', text: strings.bisexual},
						{key: 'homosexual', text: strings.homosexual}
					]} onClickHandler={this.onSelect}/>
                    <FullWidthButton onClick={this.onCancel}> {strings.cancel} </FullWidthButton>
                </div>
            </div>
        );
    }

    onSelect(key) {
        const {threadId} = this.props;
        nekunoApp.closeModal('.popup-orientation-required-' + threadId);
        let profile = {orientation: key};
        for (key in this.props.profile){
            if (this.props.profile.hasOwnProperty(key)){
                profile[key] = this.props.profile[key];
            }
        }
        UserActionCreators.editProfile(profile)
        .then(() => {
            this.props.onContinue();
        }, () => { console.log('error editing profile') });
    }

    onCancel() {
        const {threadId} = this.props;
        nekunoApp.closeModal('.popup-orientation-required-' + threadId);
    }
}

OrientationRequiredPopup.defaultProps = {
    strings: {
        title              : 'Select your sexual orientation sexual to see this yarn',
        orientationRequired: 'Orientación Requerida',
        heterosexual       : 'Heterosexual',
        bisexual           : 'Bisexual',
        homosexual         : 'Homosexual',
        cancel             : 'Cancel'
    }
};