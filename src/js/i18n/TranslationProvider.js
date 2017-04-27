import { PropTypes, Component } from 'react';
import connectToStores from '../utils/connectToStores';
import LocaleStore from '../stores/LocaleStore';

function getState(props) {

    const locale = LocaleStore.locale;

    return {
        locale
    };
}

@connectToStores([LocaleStore], getState)
export default class TranslationProvider extends Component {

    static propTypes = {
        children: PropTypes.object,
        locale  : PropTypes.string
    };

    static childContextTypes = {
        locale: PropTypes.string.isRequired
    };

    render() {
        return this.props.children;
    }

    getChildContext() {
        return {
            locale: this.props.locale
        };
    }
}

