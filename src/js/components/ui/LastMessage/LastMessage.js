import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import Emojify from 'react-emojione';
import RoundedImage from '../RoundedImage/RoundedImage.js';
import RoundedIcon from '../RoundedIcon/RoundedIcon.js';
import styles from './LastMessage.scss';

export default class LastMessage extends Component {

    static propTypes = {
        username          : PropTypes.string.isRequired,
        photo             : PropTypes.string.isRequired,
        slug              : PropTypes.string.isRequired,
        message           : PropTypes.object.isRequired,
        online            : PropTypes.bool.isRequired,
        proposalType      : PropTypes.string,
        onClickHandler    : PropTypes.func.isRequired,
        onUserClickHandler: PropTypes.func.isRequired
    };

    handleClick() {
        const {slug} = this.props;

        this.props.onClickHandler(slug);
    }

    handleClickUser() {
        const {slug} = this.props;

        this.props.onUserClickHandler(slug);
    }

    render() {
        const {username, photo, online, message, proposalType} = this.props;
        const createdAt = message.createdAt;
        let icon = null,
            background = null;
        
        if (proposalType) {
            switch (proposalType) {
                case 'professional-project':
                    icon = 'paperclip';
                    background = '#63CAFF';
                    break;
                case 'leisure-plan':
                    icon = 'send';
                    background = '#D380D3';
                    break;
                case 'experience-plan':
                    icon = 'compass';
                    background = '#7BD47E';
                    break;
            }
        }

        return (
            <div className={styles.lastMessage}>
                <div className={styles.photo} onClick={this.handleClickUser.bind(this)}>
                    <RoundedImage size={'small'} url={photo}/>
                    {online ? <div className={styles.statusOnline + ' small'}>Online</div> : ''}
                </div>
                <div className={styles.text} onClick={this.handleClick.bind(this)}>
                    {icon && background ?
                        <RoundedIcon icon={icon} size="small" background={background} fontSize={"12px"}/>
                        : null
                    }
                    <div className={styles.username + ' small'}>{username}</div>
                    <div className={styles.excerpt + ' small'} onClick={this.handleClick.bind(this)}>
                        <Emojify>{message.text}</Emojify>
                    </div>
                </div>

                <div className={styles.time + ' small'} title={createdAt.toLocaleString()} onClick={this.handleClick.bind(this)}>
                    <span className={styles.timeText}>{moment(createdAt).fromNow()}</span>
                </div>
            </div>
        );
    }
}