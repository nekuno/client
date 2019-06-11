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

        // Injected by @translate:
        strings: PropTypes.object
    };

    render() {

        const {strings} = this.props;
        return (
            <div className="card person-card">
                <div className="card-header">
                    <div className="card-content">
                        <div className="card-content-inner">
                            <div className="image fixed-max-height-image">
                                <Image src='img/loading.gif'/>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <CardUserTopLinks topLinks={[]} sharedLinks={0}/> */}
                <div className={"card-footer"}>
                    <div>
                        <div className="card-title">
                            {strings.loading}
                        </div>

                        <PercentageValue percentage={0} text={strings.matching}/>
                        <div className="matching-progress">
                            <ProgressBar percentage={0}/>
                        </div>

                        <PercentageValue percentage={0} text={strings.similarity}/>
                        <div className="similarity-progress">
                            <ProgressBar percentage={0}/>
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