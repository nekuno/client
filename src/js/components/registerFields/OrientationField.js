import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import LoginActionCreators from '../../actions/LoginActionCreators';
import * as UserActionCreators from '../../actions/UserActionCreators';

@translate('OrientationField')
export default class OrientationField extends Component {
    static propTypes = {
        onSaveHandler      : PropTypes.func,
        onOtherClickHandler: PropTypes.func,
        // Injected by @translate:
        strings            : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onClickOptionHandler = this.onClickOptionHandler.bind(this);
    }

    componentDidMount() {
        UserActionCreators.requestMetadata();
    }

    onClickOptionHandler(event) {
        const value = event.target.value;
        if (value === 'other') {
            this.props.onOtherClickHandler();
        } else if (value !== 'none') {
            const profile = {'orientation': value};
            LoginActionCreators.preRegisterProfile(profile);
            this.props.onSaveHandler();
        }
    }
    
    render() {
        const {strings} = this.props;
        const options = {
            'heterosexual': strings.heterosexual,
            'homosexual': strings.homosexual,
            'bisexual': strings.bisexual,
            'other': strings.other,
        };

        return (
            <div className="register-fields">
                <div className="register-field orientation-field">
                    <span className="orientation-text">{strings.iAm}&nbsp;</span>
                    <select onChange={this.onClickOptionHandler.bind(this)}>
                        <option key={'none'} value={'none'}>{'--'}</option>
                        {Object.keys(options).map(index => <option key={index} value={index}>{options[index]}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}

OrientationField.defaultProps = {
    strings: {
        iAm         : 'I am',
        heterosexual: 'Straight',
        homosexual  : 'Gay',
        bisexual    : 'Bisexual',
        other       : 'Other',
    }
};
