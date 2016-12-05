import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';

const maxLength = 100;

@translate('ProfileData')
export default class ProfileData extends Component {

    static propTypes = {
        name     : PropTypes.string.isRequired,
        value    : PropTypes.string.isRequired,
        forceLong: PropTypes.bool,
        // Injected by @translate:
        strings  : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.toggleOpened = this.toggleOpened.bind(this);
        this.split = this.split.bind(this);
        this.state = {
            opened: false
        };
    }

    toggleOpened() {
        this.setState({opened: !this.state.opened});
    }

    split(text) {
        return text.split("\n").map(function(item, key) {
            return (
                key + 1 === text.split("\n").length ? <span key={key}>{item}</span> : <span key={key}>{item}<br/></span>
            )
        });
    }

    render() {
        const {name, value, forceLong, strings} = this.props;
        const {opened} = this.state;
        const isLong = value.length > maxLength;

        return (
            forceLong || isLong ?
                <div className="profile-data">
                    <div className="profile-data-name-long">{name}</div>
                    <div className="profile-data-value-long">
                        { isLong ? opened ? this.split(value) : this.split(value.substring(0, maxLength) + '...') : this.split(value)}
                        { isLong ? <span className="see-more" onClick={this.toggleOpened}> {opened ? strings.seeLess : strings.seeMore}</span> : ''}
                    </div>
                </div>
                :
                <div className="profile-data">
                    <span className="profile-data-name">{name}</span> <span className="profile-data-value">{this.split(value)}</span>
                </div>
        );
    }

}

ProfileData.defaultProps = {
    strings: {
        seeLess: 'See less',
        seeMore: 'See more',
    }
};