import React, { PropTypes, Component } from 'react';
import translate from '../../i18n/Translate';

@translate('ProfileAboutMe')
export default class ProfileAboutMe extends Component {
    static propTypes = {
        value  : PropTypes.string.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.toggleSeeMore = this.toggleSeeMore.bind(this);
    }
    
    toggleSeeMore() {
        let newState = this.state != null ? this.state : {};
        newState.seeMore = !newState.seeMore;
        this.setState(newState);
    }

    render() {
        let {value, strings} = this.props;
        const seeMore = this.state ? this.state.seeMore : false;
        const maxLength = 100;
        let seeMoreText = "";
        if (value.length > maxLength) {
            if (seeMore) {
                seeMoreText = strings.seeLess;
            } else {
                value = value.substring(0, maxLength) + '...';
                seeMoreText = strings.seeMore;
            }
        }
        return (
            <div className="profile-about-me">
                <div className="profile-about-me-name">{strings.aboutMe}</div>
                <div className="profile-about-me-value">
                    {value}
                    {value.length > maxLength ?
                        <span className="see-more" onClick={this.toggleSeeMore}>{' ' + seeMoreText}</span>
                        : ''}
                </div>
            </div>

        );
    }
}

ProfileAboutMe.defaultProps = {
    strings: {
        seeLess: 'See less',
        seeMore: 'See more',
        aboutMe: 'About me'
    }
};