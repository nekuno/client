import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ContentTypeIcon.scss';
import RoundedIcon from "../RoundedIcon/RoundedIcon";

export default class ContentTypeIcon extends Component {

    static propTypes = {
        type      : PropTypes.string.isRequired,
        background: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.renderIcon = this.renderIcon.bind(this);
    }

    renderIcon() {
        const {type, background} = this.props;
        switch (type) {
            case 'Audio':
                return <RoundedIcon icon={'music'} size={'small'} background={background}/>;
            case 'Video':
                return <RoundedIcon icon={'play'} size={'small'} background={background}/>;
            case 'Image':
                return <RoundedIcon icon={'camera'} size={'small'} background={background}/>;
            case 'Creator':
                return <RoundedIcon icon={'share-2'} size={'small'} background={background}/>;
            case 'Game':
                return <RoundedIcon icon={'steam'} size={'small'} background={background}/>;
            default:
                return <RoundedIcon icon={'link'} size={'small'} background={background}/>;
        }
    };

    render() {
        return (
            <div className={styles.contentTypeIcon}>
                {this.renderIcon()}
            </div>
        );
    }
}

ContentTypeIcon.defaultProps = {
    background: '#6C6F82',
};