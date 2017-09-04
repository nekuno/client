import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Image from '../ui/Image';

export default class CardUserTopLinks extends Component {
    static propTypes = {
        topLinks   : PropTypes.array,
        sharedLinks: PropTypes.number,
    };

    render() {
        const {topLinks, sharedLinks} = this.props;
        return (
            <div>
                {sharedLinks ?
                    <div className="card-user-top-links">
                        {typeof topLinks[0] !== 'undefined' ?
                            <div className="top-link-wrapper">
                                <div className="top-link-centered-wrapper">
                                    <div className="top-link">
                                        <Image src={topLinks[0]}/>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {typeof topLinks[1] !== 'undefined' ?
                            <div className="top-link-wrapper">
                                <div className="top-link-centered-wrapper">
                                    <div className="top-link">
                                        <Image src={topLinks[1]}/>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {typeof topLinks[2] !== 'undefined' ?
                            <div className="top-link-wrapper">
                                <div className="top-link-centered-wrapper">
                                    <div className="top-link">
                                        <div className="opacity-wrapper">
                                            <Image src={topLinks[2]}/>
                                        </div>
                                        {sharedLinks > 3 ?
                                            <div className="shared-links">
                                                +{sharedLinks > 99 ? 99 : sharedLinks - 3}
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    :
                    ''
                }
            </div>
        );
    }
}