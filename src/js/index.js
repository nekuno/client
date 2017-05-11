import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import Root from './Root';
import RouterContainer from './services/RouterContainer';
import LoginActionsCreator from './actions/LoginActionCreators';
import './vendor/init';
import AnalyticsService from './services/AnalyticsService';
import GeocoderService from './services/GeocoderService';
import SocialNetworkService from './services/SocialNetworkService';
import OfflineService from './services/OfflineService';

OfflineService.check().then(() => {
    AnalyticsService.init();
    GeocoderService.init();
    SocialNetworkService.initFacebookSDK();
    RouterContainer.set(hashHistory);
    LoginActionsCreator.autologin();
    window.nekunoContainer = document.getElementById('root');
    render(<Root history={hashHistory}/>, window.nekunoContainer);
}, (status) => { console.log(status) });