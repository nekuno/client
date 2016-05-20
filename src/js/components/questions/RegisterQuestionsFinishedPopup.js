import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import * as UserActionCreators from '../../actions/UserActionCreators';
import shouldPureComponentUpdate from 'react-pure-render/function';
import FullWidthButton from '../ui/FullWidthButton';

export default class RegisterQuestionsFinishedPopup extends Component {
    static propTypes = {
        onContinue: PropTypes.func.isRequired,
        onTests: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onTests = this.onTests.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const popupClass = 'popup popup-register-finished tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <div className="popup-register-finished-title title"> ¡Felicidades!</div>
                    <div className="popup-register-finished-text">
                        Has completado las primeras 4 preguntas indispensables,
                        si quieres seguir contestando preguntas para mejorar las recomendaciones,
                        puedes hacerlo desde tu perfil
                    </div>
                    <FullWidthButton onClick={this.onTests}> Hacer más tests</FullWidthButton>
                    <br />
                    <br />
                    <FullWidthButton onClick={this.onContinue}> Continuar</FullWidthButton>
                </div>
            </div>
        );
    }

    onTests() {
        nekunoApp.closeModal('.popup-register-finished');
        this.props.onTests();
    };


    onContinue() {
        nekunoApp.closeModal('.popup-register-finished');
        this.props.onContinue();
    }
}
