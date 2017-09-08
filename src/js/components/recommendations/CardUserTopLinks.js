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
            <div className="card-user-top-links">
                {typeof topLinks[0] === 'undefined' && sharedLinks > 0 ?
                    <div className="top-link-wrapper">
                        <div className="top-link">
                            <Image src={'img/default-content-image-squared-small.jpg'}/>
                        </div>
                        {sharedLinks > 1 ?
                            <div className="shared-link-wrapper">
                                <div className="shared-links">
                                    +{sharedLinks > 99 ? 99 : sharedLinks - 1}
                                </div>
                            </div>
                            : null
                        }
                    </div>
                    :
                    null
                }
                {typeof topLinks[0] !== 'undefined' ?
                    <div className="top-link-wrapper">
                        <div className="top-link">
                            <Image src={topLinks[0]}/>
                        </div>
                        {typeof topLinks[1] === 'undefined' && sharedLinks > 1 ?
                            <div className="shared-link-wrapper">
                                <div className="shared-links">
                                    +{sharedLinks > 99 ? 99 : sharedLinks - 1}
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    :
                    null
                }
                {typeof topLinks[1] !== 'undefined' ?
                    <div className="top-link-wrapper">
                        <div className="top-link">
                            <Image src={topLinks[1]}/>
                        </div>
                        {typeof topLinks[2] === 'undefined' && sharedLinks > 2 ?
                            <div className="shared-link-wrapper">
                                <div className="shared-links">
                                    +{sharedLinks > 99 ? 99 : sharedLinks - 2}
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    :
                    null
                }
                {typeof topLinks[2] !== 'undefined' ?
                    <div className="top-link-wrapper">
                        <div className="top-link">
                            <Image src={topLinks[2]}/>
                        </div>
                        {sharedLinks > 3 ?
                            <div className="shared-link-wrapper">
                                <div className="shared-links">
                                    +{sharedLinks > 99 ? 99 : sharedLinks - 3}
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}