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
                this.handleClickOutside = this.handleClickOutside.bind(this);
                this._isOpened = this._isOpened.bind(this);

            }

            componentWillUnmount() {
                window.nekunoContainer.removeEventListener('click', this.handleClickOutside)
            }

            componentDidUpdate() {
                if (this.context.router.location.hash !== '#popup' && this._isOpened()) {
                    this.close();
                }
            }
            
            show() {
                Framework7Service.nekunoApp().popup('.' + popupClass);
                Framework7Service.$$()('.' + popupClass).once('popup:closed', () => {
                    if (this.context.router.location.hash === '#popup') {
                        this.context.router.goBack();
                    }
                });
                Framework7Service.$$()('.' + popupClass).once('popup:opened', () => {
                    window.nekunoContainer.addEventListener('click', this.handleClickOutside)
                });
                this.context.router.push(this.context.router.location.pathname + '#popup');
            }

            close() {
                Framework7Service.nekunoApp().closeModal('.' + popupClass);
            }

            handleClickOutside(e) {
                const popupContent = this.popupContentElement;
                if (this._isOpened() && popupContent && !popupContent.contains(e.target)) {
                    this.close();
                }
            }

            _isOpened() {
                return Framework7Service.$$()('.' + popupClass).hasClass('modal-in');
            }

            render() {
                return (
                    <Component {...this.props} showPopup={this.show} closePopup={this.close} popupContentRef={el => this.popupContentElement = el}/>
                );
            }
        }

        return PopupComponent;
    };
}