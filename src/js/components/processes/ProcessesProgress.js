import React, { PropTypes, Component } from 'react';
var Line = require('rc-progress').Line;
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import WorkersStore from '../../stores/WorkersStore';

function getState() {
    const linksPercentage = WorkersStore.getLinksPercentage();
    const similarityPercentage = WorkersStore.getSimilarityPercentage();
    const matchingPercentage = WorkersStore.getMatchingPercentage();

    return {
        linksPercentage,
        similarityPercentage,
        matchingPercentage
    };
}

@translate('ProcessesProgress')
@connectToStores([WorkersStore], getState)
export default class ProcessesProgress extends Component {
    static propTypes = {
        linksPercentage     : PropTypes.number,
        similarityPercentage: PropTypes.number,
        matchingPercentage  : PropTypes.number
    };
    
    constructor(props) {
        super(props);

        this.renderProgress = this.renderProgress.bind(this);
    }
    
    renderProgress(type, percent) {
        const {strings} = this.props;
        let title = '';
        switch (type) {
            case 'linksPercentage':
                title = strings.linksTitle;
                break;
            case 'similarityPercentage':
                title = strings.similarityTitle;
                break;
            case 'matchingPercentage':
                title = strings.matchingTitle;
                break;
            default:
        }
        return (
            <div className="process-progress">
                <div className="process-progress-title">{title} - {percent}%</div>
                <Line percent={percent} strokeWidth="2" strokeColor="purple" />
                <br />
                <br />
            </div>
        );
    }

    render() {
        const {linksPercentage, similarityPercentage, matchingPercentage} = this.props;
        return (
            <div className="processes-progress">
                {linksPercentage !== null ? this.renderProgress('linksPercentage', linksPercentage) : null}
                {similarityPercentage !== null ? this.renderProgress('similarityPercentage', similarityPercentage) : null}
                {matchingPercentage !== null ? this.renderProgress('matchingPercentage', matchingPercentage) : null}
            </div>
        );
    }
}

ProcessesProgress.defaultProps = {
    strings: {
        linksTitle     : 'Processing links',
        similarityTitle: 'Calculating similarity',
        matchingTitle  : 'Calculating matching'
    }
};