import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './BottomNotificationBar.scss';
import ProgressBar from "../ProgressBar/ProgressBar";
import connectToStores from "../../../utils/connectToStores";
import WorkersStore from "../../../stores/WorkersStore";
import translate from "../../../i18n/Translate";

function getState() {
    const linksPercentage = WorkersStore.getLinksPercentage();

    return {
        linksPercentage
    };
}

@translate('BottomNotificationBar')
@connectToStores([WorkersStore], getState)
export default class BottomNotificationBar extends Component {

    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object,
        //Injected by @connectToStores
        linksPercentage      : PropTypes.number,
    };

    render() {
        const {children, strings, linksPercentage} = this.props;
        let displayStyle = null;
        switch (linksPercentage) {
            case null:
                displayStyle = styles.hidden;
                break;
            case 100:
                displayStyle = styles.fadeOut;
                break;
            default:
                ((displayStyle !== styles.fadeIn) ? displayStyle = styles.fadeIn : '');
                break;
        }
        return (
            <div className={displayStyle}>
                <div className={styles.bottomNotificationBar}>
                    <div className={styles.bottomNotificationBarText}>{strings.analyzingData}</div>
                    <div className={styles.bottomNotificationBarProgressbar}>
                        <ProgressBar percentage={linksPercentage} textColor={'#F0F1FA'} size={'small'} background={'#756EE5'} strokeColor={'#FFF'}/>
                    </div>
                </div>
            </div>
        );
    }
}

BottomNotificationBar.defaultProps = {
    strings: {
        analyzingData   : 'Analyzing data...',
    }
};