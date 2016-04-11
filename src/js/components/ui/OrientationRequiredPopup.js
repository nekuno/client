import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import * as UserActionCreators from '../../actions/UserActionCreators';
import shouldPureComponentUpdate from 'react-pure-render/function';
import TextRadios from './TextRadios';
import FullWidthButton from './FullWidthButton';

export default class OrientationRequiredPopup extends Component {
    static propTypes = {
        profile: PropTypes.object.isRequired,
        onContinue: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const popupClass = 'popup popup-orientation-required tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-orientation-required-title title">Orientación Requerida</div>

                    <TextRadios title={'Indícanos tu orientación sexual para ver este hilo'} labels={[
						{key: 'heterosexual', text: 'Heterosexual'},
						{key: 'bisexual', text: 'Bisexual'},
						{key: 'homosexual', text: 'Homosexual'}
					]} onClickHandler={this.onSelect}/>
                    <FullWidthButton onClick={this.onCancel}> Cancelar </FullWidthButton>
                </div>
            </div>
        );
    }

    onSelect(key){
        let onContinue = this.props.onContinue;
        let profile = {orientation: key};
        for (key in this.props.profile){
            if (this.props.profile.hasOwnProperty(key)){
                profile[key] = this.props.profile[key];
            }
        }
        UserActionCreators.editProfile(profile)
        .then(function(){
            nekunoApp.closeModal('.popup-orientation-required');
            onContinue();
        });
    }

    onCancel(){
        nekunoApp.closeModal('.popup-orientation-required');
    }
}
