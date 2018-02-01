import PropTypes from 'prop-types';
import React from 'react';
import Framework7Service from '../services/Framework7Service';

export default function popup(popupClass) {

    return Component => {
        class PopupComponent extends React.Component {
            static contextTypes = {
                router: PropTypes.object.isRequired
            };

            constructor(props) {
                super(props);
                this.show = this.show.bind(this);
                this.close = this.close.bind(this);
                this.onOpen = this.onOpen.bind(this);
                this.onClose = this.onClose.bind(this);
                this.handleClickOutside = this.handleClickOutside.bind(this);
                this._isOpened = this._isOpened.bind(this);

                this.state = {
                    opened: false
                }
            }

            componentWillUnmount() {
                window.nekunoContainer.removeEventListener('click', this.handleClickOutside);
            }

            componentWillUpdate(nextProps, nextState) {
                if (this.state.opened && !nextState.opened) {
                    window.nekunoContainer.removeEventListener('click', this.handleClickOutside);
                }
            }

            componentDidUpdate(prevProps, prevState) {
                if (!this.state.opened && prevState.opened) {
                    if (this.context.router.location.hash === '#popup') {
                        this.context.router.goBack();
                    }
                } else if (this.state.opened && !prevState.opened) {
                    window.nekunoContainer.addEventListener('click', this.handleClickOutside);
                }

                if (this.context.router.location.hash !== '#popup' && this._isOpened()) {
                    this.close();
                }
            }
            
            show(popup = popupClass) {
                if (Array.isArray(popup)) {
                    console.error('Open popup with popup.showContent(popupClass) when using more than one popup with @popup([popupClass1, popupClass2, ...])');
                    return;
                }
                Framework7Service.nekunoApp().popup('.' + popup);
                Framework7Service.$$()('.' + popup).once('popup:closed', () => {
                    this.onClose();
                });
                Framework7Service.$$()('.' + popup).once('popup:opened', () => {
                    this.onOpen();
                });
                this.context.router.push(this.context.router.location.pathname + '#popup');
            }

            close(popup = popupClass) {
                if (Array.isArray(popup)) {
                    Framework7Service.nekunoApp().closeModal();
                } else {
                    Framework7Service.nekunoApp().closeModal('.' + popup);
                }
                this.onClose();
            }

            onOpen() {
                this.setState({opened: true});
            }

            onClose() {
                this.setState({opened: false});
            }

            handleClickOutside(e) {
                const popupContent = this.popupContentElement;
                if (this._isOpened() && popupContent && !popupContent.contains(e.target)) {
                    this.close();
                }
            }

            _isOpened() {
                if (Array.isArray(popupClass)) {
                    return popupClass.some(popup => Framework7Service.$$()('.' + popup).hasClass('modal-in'));
                }

                return Framework7Service.$$()('.' + popupClass).hasClass('modal-in');
            }

            render() {
                const {opened} = this.state;
                return (
                    <Component {...this.props} showPopup={this.show} closePopup={this.close} opened={opened} popupContentRef={el => this.popupContentElement = el}/>
                );
            }
        }

        return PopupComponent;
    };
}