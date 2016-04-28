import { default as React } from 'react';
import en from './en';
import es from './es';

const locales = {en, es};

export default function translate(key) {
    return Component => {
        class TranslationComponent extends React.Component {

            componentWillMount() {
                let strings = locales[this.context.locale]['Framework7'];
                nekunoApp.params.modalTitle = strings.modalTitle;
                nekunoApp.params.modalButtonOk = strings.modalButtonOk;
                nekunoApp.params.modalButtonCancel = strings.modalButtonCancel;
            }

            render() {
                var strings = locales[this.context.locale][key];
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
            locale: React.PropTypes.string
        };

        return TranslationComponent;
    };
}