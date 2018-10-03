import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './TopNavBar.scss';
import TopBar from '../ui/TopBar/TopBar.js';
import IconNotification from '../ui/IconNotification/IconNotification.js';
import RoundedIcon from '../ui/RoundedIcon/RoundedIcon.js';
import RoundedImage from '../ui/RoundedImage/RoundedImage.js';
import RouterActionCreators from '../../actions/RouterActionCreators';

export default class TopNavBar extends Component {

    static propTypes = {
        position                     : PropTypes.oneOf(['relative', 'absolute']),
        background                   : PropTypes.string,
        color                        : PropTypes.string,
        boxShadow                    : PropTypes.bool,
        textAlign                    : PropTypes.oneOf(['center', 'left']),
        textSize                     : PropTypes.oneOf(['regular', 'small']),
        iconLeft                     : PropTypes.string,
        textLeft                     : PropTypes.string,
        imageLeft                    : PropTypes.string,
        textLeftColored              : PropTypes.bool,
        textCenter                   : PropTypes.string,
        firstIconRight               : PropTypes.string,
        secondIconRight              : PropTypes.string,
        iconsRightBackground         : PropTypes.string,
        imageRight                   : PropTypes.string,
        proposalsIcon                : PropTypes.bool,
        proposalsCount               : PropTypes.number,
        messagesIcon                 : PropTypes.bool,
        messagesCount                : PropTypes.number,
        textRight                    : PropTypes.string,
        textRightColored             : PropTypes.bool,
        onLeftLinkClickHandler       : PropTypes.func,
        onRightLinkClickHandler      : PropTypes.func,
        onSecondRightLinkClickHandler: PropTypes.func,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    handleLeftClick() {
        if (this.props.onLeftLinkClickHandler) {
            this.props.onLeftLinkClickHandler();
        } else {
            this.goBack.bind(this)();
        }
    }

    goBack() {
        RouterActionCreators.previousRoute(this.context.router.getCurrentLocation().pathname || '');
    }

    goToProposals() {

    }

    goToMessages() {

    }

    render() {
        const {
            position,
            background,
            color,
            boxShadow,
            textAlign,
            textSize,
            iconLeft,
            textLeft,
            imageLeft,
            textLeftColored,
            textCenter,
            firstIconRight,
            secondIconRight,
            iconsRightBackground,
            imageRight,
            proposalsIcon,
            proposalsCount,
            messagesIcon,
            messagesCount,
            textRight,
            textRightColored
        } = this.props;
        const leftClassName = textSize === 'small' ? styles.left + ' ' + styles.small : styles.left;
        const centerClassName = textSize === 'small' ? styles.center + ' ' + styles.small : styles.center;
        const rightClassName = textSize === 'small' ? styles.right + ' ' + styles.small : styles.right;
        const textLeftClassName = textLeftColored ? styles.linkColored + ' ' + styles.link : styles.link;
        const textRightClassName = textRightColored ? styles.linkColored + ' ' + styles.link : styles.link;

        return (
            <TopBar position={position} background={background} textAlign={textAlign} color={color} boxShadow={boxShadow}>
                <div className={leftClassName} onClick={this.handleLeftClick.bind(this)}>
                    {iconLeft ?
                        <div className={styles.icon + ' icon icon-' + iconLeft}/>
                        : imageLeft ?
                            <RoundedImage url={imageLeft}
                                          size="x-small"
                            />
                            : <div className={textLeftClassName}>{textLeft}</div>
                    }
                </div>

                <div className={centerClassName}>
                    {textCenter || ' '}
                </div>

                <div className={rightClassName}>
                    {firstIconRight ?
                        iconsRightBackground ?
                            <div className={styles.roundedIcon}>
                                <RoundedIcon icon={firstIconRight}
                                             size="small"
                                             background={iconsRightBackground}
                                             fontSize={'15px'}
                                             onClickHandler={this.props.onRightLinkClickHandler}
                                />
                            </div>
                            :
                            <div className={styles.icon + ' icon icon-' + firstIconRight} onClick={this.props.onRightLinkClickHandler}/>
                        : null
                    }
                    {secondIconRight ?
                        iconsRightBackground ?
                            <div className={styles.roundedIcon + ' ' + styles.second}>
                                <RoundedIcon icon={secondIconRight}
                                             size="small"
                                             background={iconsRightBackground}
                                             fontSize={'15px'}
                                             onClickHandler={this.props.onSecondRightLinkClickHandler}
                                />
                            </div>
                            :
                            <div className={styles.icon + ' icon icon-' + secondIconRight + ' ' + styles.second} onClick={this.props.onSecondRightLinkClickHandler}/>
                        : null
                    }
                    {imageRight ?
                        <RoundedImage url={imageRight}
                                      size="small"
                                      onClickHandler={this.props.onRightLinkClickHandler}
                        />
                        : null
                    }
                    {messagesIcon ?
                        <IconNotification icon={'mail'}
                                          notifications={messagesCount}
                                          onClickHandler={this.goToMessages.bind(this)}
                        />
                        : null
                    }
                    {proposalsIcon ?
                        <IconNotification icon={'user'}
                                          notifications={proposalsCount}
                                          onClickHandler={this.goToProposals.bind(this)}
                        />
                        : null
                    }
                    {textRight ?
                        <div className={textRightClassName} onClick={this.props.onRightLinkClickHandler}>
                            {textRight}
                        </div>
                        : null
                    }
                </div>
            </TopBar>
        );
    }
}