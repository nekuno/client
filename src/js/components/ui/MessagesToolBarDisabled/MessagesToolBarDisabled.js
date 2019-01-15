import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import Framework7Service from '../../../services/Framework7Service';
import styles from './MessagesToolBarDisabled.scss';
import RoundedImage from "../RoundedImage/RoundedImage";


@translate('MessagesToolBarDisabled')
export default class MessagesToolBarDisabled extends Component {

    static propTypes = {
        text          : PropTypes.string.isRequired,
        // Injected by @translate:
        strings    : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.alertDisabled=this.alertDisabled.bind(this);
    }

    alertDisabled() {
        Framework7Service.nekunoApp().alert(this.props.strings.forbidden);
    }

    render() {
        const {text} = this.props;
        return (
                <div className={styles.toolbar}>
                    <div className={styles.toolbarInner} onClick={this.alertDisabled}>
                        <div className={styles.textareaWrapper}>
                            {/*<RoundedImage url={image} size={"xx-small"}/>*/}
                            <textarea placeholder={this.props.strings.forbidden} ref="textarea" disabled/>
                        </div>
                        <a className={styles.link} disabled="disabled" style={{color: "#F44336"}}>{text}</a>
                    </div>
                </div>

        );
    }
}

MessagesToolBarDisabled.defaultProps = {
    strings: {
        forbidden:'This user does not accept messages right now'
    }
};
