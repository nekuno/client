import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../../actions/UserActionCreators';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TextRadios from './TextRadios';
import FullWidthButton from './FullWidthButton';
import translate from '../../i18n/Translate';

@translate('OrientationRequiredPopup')
export default class OrientationRequiredPopup extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired,
        onContinue: PropTypes.func.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const popupClass = 'popup popup-orientation-required tablet-fullscreen';
        const {strings} = this.props;

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
        nekunoApp.closeModal('.popup-orientation-required');
        let onContinue = this.props.onContinue;
        let profile = {orientation: key};
        for (key in this.props.profile){
            if (this.props.profile.hasOwnProperty(key)){
                profile[key] = this.props.profile[key];
            }
        }
        UserActionCreators.editProfile(profile)
        .then(function(){
            onContinue();
        });
    }

    onCancel(){
        nekunoApp.closeModal('.popup-orientation-required');
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