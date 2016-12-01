import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';

const maxLength = 100;

@translate('ProfileData')
export default class ProfileData extends Component {

    static propTypes = {
        name   : PropTypes.string.isRequired,
        value  : PropTypes.string.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.toggleSeeMore = this.toggleSeeMore.bind(this);
        this.state = {
            seeMore: props.value.length < maxLength
        };
    }

    toggleSeeMore() {
        this.setState({seeMore: !this.state.seeMore});
    }

    render() {
        const {name, value, strings} = this.props;
        const {seeMore} = this.state;
        const long = value.length > maxLength;

        return (
            long ?
                <div className="profile-data">
                    <div className="profile-data-name-long">{name}</div>
                    <div className="profile-data-value-long">
                        {seeMore ? value : value.substring(0, maxLength) + '...'}
                        <span className="see-more" onClick={this.toggleSeeMore}> {seeMore ? strings.seeLess : strings.seeMore}</span>
                    </div>
                </div>
                :
                <div className="profile-data">
                    <span className="profile-data-name">{name}</span> <span className="profile-data-value">{value}</span>
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