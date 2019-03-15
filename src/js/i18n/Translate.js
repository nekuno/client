import PropTypes from 'prop-types';
import { default as React } from 'react';
import TranslationService from '../services/TranslationService';
import Framework7Service from '../services/Framework7Service';

export default function translate(key) {
    return Component => {
        class TranslationComponent extends React.Component {

            componentWillMount() {
                let strings = TranslationService.getCategoryStrings(this.context.locale, 'Framework7');
                if (Framework7Service.nekunoApp().params) {
                    Framework7Service.nekunoApp().params.modalTitle = strings.modalTitle;
                    Framework7Service.nekunoApp().params.modalButtonOk = strings.modalButtonOk;
                    Framework7Service.nekunoApp().params.modalButtonCancel = strings.modalButtonCancel;
                }
            }

            render() {
                const strings = TranslationService.getCategoryStrings(this.context.locale, key);
                const merged = {
                    ...this.props.strings,
                    ...strings
                };
                if (strings) {
                    return <Component {...this.props} strings={merged} locale={this.context.locale}/>;
                } else {
                    return <Component {...this.props} locale={this.context.locale}/>;
                }

            }
        }

        TranslationComponent.contextTypes = {
            locale: PropTypes.string
        };

        return TranslationComponent;
    };
}