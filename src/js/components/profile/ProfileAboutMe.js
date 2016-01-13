import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from '../../../../node_modules/react-pure-render/function';
import selectn from 'selectn';

export default class ProfileAboutMe extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;
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
            <div className="profileAboutMe">
                <div className="profileAboutMeName">{name}</div>

                <div className="profileAboutMeValue">
                    {value}
                    {value.length > maxLength
                        ?
                        <span className="seeMore" onClick={this.toggleSeeMore}>{' '+seeMoreText}</span>
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
        //this.state['seeMore'] = (this.state !== null)? !this.state.seeMore : true;
    }

}
