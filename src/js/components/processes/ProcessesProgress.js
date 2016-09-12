import React, { PropTypes, Component } from 'react';
var Line = require('rc-progress').Line;
import AuthenticatedComponent from '../../components/AuthenticatedComponent';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import WorkersStore from '../../stores/WorkersStore';
import ThreadsByUserStore from '../../stores/ThreadsByUserStore';
import RecommendationsByThreadStore from '../../stores/RecommendationsByThreadStore';

function getState(props) {
    const linksPercentage = WorkersStore.getLinksPercentage();
    const similarityPercentage = WorkersStore.getSimilarityPercentage();
    const matchingPercentage = WorkersStore.getMatchingPercentage();
    const affinityPercentage = WorkersStore.getAffinityPercentage();
    const isJustRegistered = WorkersStore.isJustRegistered();
    const registerWorkersFinish = WorkersStore.hasRegisterWorkersFinished();
    const countNetworksWorking = WorkersStore.countNetworksWorking();

    let threadsPercentage = null;
    const threads = ThreadsByUserStore.getThreadsFromUser(props.user.id);
    if (threads){
        const emptyThreads = threads.filter(id => RecommendationsByThreadStore.isEmpty(id));
        threadsPercentage = threads.length > 0 ? Math.round(100 * (1 - (emptyThreads.length / threads.length))) : null;
    }

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
@connectToStores([WorkersStore], getState)
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
            case 'threadsPercentage':
                title = strings.threadsTitle;
                break;
            default:
        }
        return (
            <div className="process-progress">
                <div className="process-progress-title">{title} - {percent || 0}%</div>
                <Line percent={percent} strokeWidth="2" strokeColor="#32ca91"/>
                <br />
                <br />
            </div>
        );
    }

    render() {
        const {linksPercentage, similarityPercentage, matchingPercentage, affinityPercentage, threadsPercentage, countNetworksWorking, isJustRegistered, strings} = this.props;
        let layerHeight = 0;
        layerHeight += linksPercentage !== null || isJustRegistered ? 65 : 0;
        layerHeight += similarityPercentage !== null || isJustRegistered ? 65 : 0;
        layerHeight += matchingPercentage !== null || isJustRegistered ? 65 : 0;
        layerHeight += affinityPercentage !== null || isJustRegistered ? 65 : 0;
        layerHeight = layerHeight ? layerHeight + 65 : 0;
        return (
            linksPercentage !== null || similarityPercentage !== null || matchingPercentage !== null || affinityPercentage !== null ?
                <div>
                    <div className="processes-progress">
                        <div className="processes-progress-title">{isJustRegistered ? strings.registrationTitle : strings.title}</div>
                        {linksPercentage !== null || isJustRegistered ? this.renderProgress('linksPercentage', linksPercentage) : null}
                        {similarityPercentage !== null || isJustRegistered ? this.renderProgress('similarityPercentage', similarityPercentage) : null}
                        {matchingPercentage !== null || isJustRegistered ? this.renderProgress('matchingPercentage', matchingPercentage) : null}
                        {affinityPercentage !== null || isJustRegistered ? this.renderProgress('affinityPercentage', affinityPercentage) : null}
                        {threadsPercentage !== null && (countNetworksWorking > 0 || similarityPercentage || matchingPercentage || affinityPercentage) ? this.renderProgress('processingThreads', threadsPercentage) : null}
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
        threadsTitle            : 'Creating more threads',
        linksPreparingTitle     : 'Preparing to process links',
        similarityPreparingTitle: 'Preparing to calculate similarity',
        matchingPreparingTitle  : 'Preparing to calculate matching',
        affinityPreparingTitle  : 'Preparing to calculate affinity',
        registerWorkersFinish   : 'Congratulations! The registration processes have finished.'
    }
};