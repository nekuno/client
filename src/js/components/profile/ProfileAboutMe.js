import React, { PropTypes, Component } from 'react';

export default class ProfileAboutMe extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.toggleSeeMore = this.toggleSeeMore.bind(this);
    }

    render() {
        let {name, value} = this.props;
        const seeMore = this.state? this.state.seeMore : false;
        const maxLength = 100;
        let seeMoreText = "";
        if (value.length > maxLength){
            if (seeMore){
                seeMoreText = 'Ver menos';
            } else {
                value = value.substring(0,maxLength)+'...';
                seeMoreText = 'Ver más';
            }
        }
        return (
            <div className="profile-about-me">
                <div className="profile-about-me-name">{name}</div>

                <div className="profile-about-me-value">
                    {value}
                    {value.length > maxLength
                        ?
                        <span className="see-more" onClick={this.toggleSeeMore}>{' '+seeMoreText}</span>
                        : ""
                    }

                </div>

            </div>

        );
    }

    toggleSeeMore()
    {
        let newState = this.state != null? this.state : {};
        newState.seeMore = !newState.seeMore;
        this.setState(newState);
    }

}
