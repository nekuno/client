import React, { PropTypes, Component } from 'react';
var Line = require('rc-progress').Line;
import AuthenticatedComponent from '../../components/AuthenticatedComponent';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import WorkersStore from '../../stores/WorkersStore';
import ThreadStore from '../../stores/ThreadStore';

function getState() {
    const linksPercentage = WorkersStore.getLinksPercentage();
    const similarityPercentage = WorkersStore.getSimilarityPercentage();
    const matchingPercentage = WorkersStore.getMatchingPercentage();
    const affinityPercentage = WorkersStore.getAffinityPercentage();
    const isJustRegistered = WorkersStore.isJustRegistered();
    const registerWorkersFinish = WorkersStore.hasRegisterWorkersFinished();
    const countNetworksWorking = WorkersStore.countNetworksWorking();

    const threadIds = ThreadStore.getAll();
    const threads = threadIds ? Object.keys(threadIds).map(threadId => threadIds[threadId]) : [];
    const emptyThreads = threads.filter(thread => ThreadStore.isDisabled(thread.id));
    let threadsPercentage = threads.length > 0 ? Math.round(100 * (1 - (emptyThreads.length / threads.length))) : null;
    threadsPercentage = threadsPercentage === 100 && !isJustRegistered ? null : threadsPercentage;

    return {
        linksPercentage,
        similarityPercentage,
        matchingPercentage,
        affinityPercentage,
        threadsPercentage,
        countNetworksWorking,
        isJustRegistered,
        registerWorkersFinish
    };
}

@AuthenticatedComponent
@translate('ProcessesProgress')
@connectToStores([WorkersStore, ThreadStore], getState)
export default class ProcessesProgress extends Component {
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        //Injected by @connectToStores
        linksPercentage      : PropTypes.number,
        similarityPercentage : PropTypes.number,
        matchingPercentage   : PropTypes.number,
        affinityPercentage   : PropTypes.number,
        threadsPercentage    : PropTypes.number,
        countNetworksWorking : PropTypes.number,
        isJustRegistered     : PropTypes.bool,
        registerWorkersFinish: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.renderProgress = this.renderProgress.bind(this);
    }

    componentDidUpdate() {
        const {registerWorkersFinish, strings} = this.props;
        if (registerWorkersFinish) {
            nekunoApp.alert(strings.registerWorkersFinish);
        }
    }

    renderProgress(type, percent) {
        const {strings} = this.props;
        let title = '';
        switch (type) {
            case 'linksPercentage':
                title = percent ? strings.linksTitle : strings.linksPreparingTitle;
                break;
            case 'similarityPercentage':
                title = percent ? strings.similarityTitle : strings.similarityPreparingTitle;
                break;
            case 'matchingPercentage':
                title = percent ? strings.matchingTitle : strings.matchingPreparingTitle;
                break;
            case 'affinityPercentage':
                title = percent ? strings.affinityTitle : strings.affinityPreparingTitle;
                break;
            case 'processingThreads':
                title = strings.threadsTitle;
                break;
            default:
        }
        return (
            <div className="process-progress">
                <div className="process-progress-title">{title} - {percent || 0}%</div>
                <div className="progress-line">
                    <Line percent={percent} strokeWidth="2" strokeColor="#32ca91"/>
                </div>
                <br />
                <br />
            </div>
        );
    }

    render() {
        const {linksPercentage, similarityPercentage, matchingPercentage, affinityPercentage, threadsPercentage, countNetworksWorking, isJustRegistered, strings} = this.props;
        let layerHeight = 0;
        layerHeight += linksPercentage !== null || isJustRegistered ? 62 : 0;
        layerHeight += similarityPercentage !== null || isJustRegistered ? 62 : 0;
        layerHeight += matchingPercentage !== null || isJustRegistered ? 62 : 0;
        layerHeight += affinityPercentage !== null || isJustRegistered ? 62 : 0;
        layerHeight += threadsPercentage !== null || isJustRegistered ? 62 : 0;
        layerHeight = layerHeight ? layerHeight + 72 : 0;
        return (
            linksPercentage !== null || similarityPercentage !== null || matchingPercentage !== null || affinityPercentage !== null || threadsPercentage !== null ?
                <div>
                    <div className="processes-progress">
                        <div className="processes-progress-title">{isJustRegistered ? strings.registrationTitle : strings.title}</div>
                        {linksPercentage !== null || isJustRegistered ? this.renderProgress('linksPercentage', linksPercentage) : null}
                        {similarityPercentage !== null || isJustRegistered ? this.renderProgress('similarityPercentage', similarityPercentage) : null}
                        {matchingPercentage !== null || isJustRegistered ? this.renderProgress('matchingPercentage', matchingPercentage) : null}
                        {affinityPercentage !== null || isJustRegistered ? this.renderProgress('affinityPercentage', affinityPercentage) : null}
                        {threadsPercentage !== null || isJustRegistered ? this.renderProgress('processingThreads', threadsPercentage) : null}
                    </div>
                    <div style={{height: layerHeight + 'px'}}></div>
                </div>
                :
                null
        );
    }
}

ProcessesProgress.defaultProps = {
    strings: {
        title                   : 'We are reprocessing your data',
        registrationTitle       : 'We are analyzing your data',
        linksTitle              : 'Processing links',
        similarityTitle         : 'Calculating similarity',
        matchingTitle           : 'Calculating matching',
        affinityTitle           : 'Calculating affinity',
        threadsTitle            : 'Creating more yarns',
        linksPreparingTitle     : 'Preparing to process links',
        similarityPreparingTitle: 'Preparing to calculate similarity',
        matchingPreparingTitle  : 'Preparing to calculate matching',
        affinityPreparingTitle  : 'Preparing to calculate affinity',
        registerWorkersFinish   : 'Congratulations! The registration processes have finished.'
    }
};