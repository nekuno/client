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

            // TranslationComponent receives ref from parent, so this is a wrapper to use children methods.
            getSelectedFilter() {
                let filter = null;
                Object.keys(this.refs).forEach(function(value){
                    if (typeof this.refs[value].getSelectedFilter === 'function'){
                        filter = this.refs[value].getSelectedFilter();
                    }
                }, this);

                return filter;
            }

            selectedFilterContains(a) {
                let contains = null;
                Object.keys(this.refs).forEach(function(value){
                    if (typeof this.refs[value].selectedFilterContains === 'function'){
                        contains = this.refs[value].selectedFilterContains(a);
                    }
                }, this);

                return contains;
            }

            render() {
                var strings = locales[this.context.locale][key];
                const merged = {
                    ...this.props.strings,
                    ...strings
                };
                if (strings) {
                    return <Component {...this.props} ref={Date.now()} strings={merged} locale={this.context.locale}/>;
                } else {
                    return <Component {...this.props} ref={Date.now()} locale={this.context.locale}/>;
                }

            }
        }

        TranslationComponent.contextTypes = {
            locale: React.PropTypes.string
        };

        return TranslationComponent;
    };
}