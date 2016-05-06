import React, { PropTypes, Component } from 'react';
import TopLeftIcon from '../ui/TopLeftIcon';
import RegularTopTitle from '../ui/RegularTopTitle';
import TopRightUserIcons from './TopRightUserIcons';

export default class UserTopNavbar extends Component {
    static propTypes = {
        centerText: PropTypes.string
    };

    render() {
        return (
            <div className="navbar">
                <div id="navbar-inner" className="navbar-inner">
                    <div className="row">
                        <TopLeftIcon icon={'left-arrow'}/>
                        <RegularTopTitle text={this.props.centerText}/>
                        <TopRightUserIcons/>
                    </div>
                </div>
            </div>
        );
    }
}