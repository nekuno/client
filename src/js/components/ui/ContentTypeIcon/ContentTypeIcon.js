import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ContentTypeIcon.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";

export default class ContentTypeIcon extends Component {

    static propTypes = {
        type : PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.renderIcon = this.renderIcon.bind(this);
    }

    renderIcon() {
        switch (this.props.type) {
            case 'Audio':
                return <RoundedIcon icon={'music'} size={'small'}/>;
            case 'Video':
                return <RoundedIcon icon={'play'} size={'small'}/>;
            case 'Image':
                return <RoundedIcon icon={'camera'} size={'small'}/>;
            case 'Creator':
                return <RoundedIcon icon={'share-2'} size={'small'}/>;
            case 'Game':
                return <RoundedIcon icon={'steam'} size={'small'}/>;
            default:
                return <RoundedIcon icon={'link'} size={'small'}/>;
        }
    };


    render() {
        return (
            <div className={styles.contentTypeIcon} >
                {this.renderIcon()}
            </div>
        );
    }
}