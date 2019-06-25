import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgressBar from '../ui/ProgressBar';
import Image from '../ui/Image';
import CardUserTopLinks from '../recommendations/CardUserTopLinks';
import translate from '../../i18n/Translate';
import PercentageValue from "./PercentageValue";

@translate('CardUserPlaceholder')
export default class CardUserPlaceholder extends Component {

    static propTypes = {
        className: PropTypes.string,
        // Injected by @translate:
        strings: PropTypes.object
    };

    render() {

        const {strings} = this.props;
        return (
            <div className={`${this.props.className} card person-card`}>
                <div className="card-header">
                    <div className="card-content">
                        <div className="card-content-inner">
                            <div className="image fixed-max-height-image">
                                <div className="loading-gif" style={{height: 0, paddingBottom: '100%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <CardUserTopLinks topLinks={[]} sharedLinks={0}/> */}
                <div className={"card-footer"}>
                    <div>
                        <div className="matching-string">{strings.matching}</div>
                        <div className="matching-value">
                            <ProgressBar percentage={0}/>
                            <div className="matching-percentage"></div>
                        </div>
                        
                        <div className="matching-string">{strings.similarity}</div>
                        <div className="matching-value">
                            <ProgressBar percentage={0}/>
                            <div className="matching-percentage"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

CardUserPlaceholder.defaultProps = {
    strings: {
        matching  : 'Matching',
        similarity: 'Similarity',
        loading   : 'Loading...',
    }
};