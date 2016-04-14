import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import Root from './Root';
import RouterContainer from './services/RouterContainer';
import LoginActionsCreator from './actions/LoginActionCreators';
import './vendor/init';

const history = createHashHistory();
RouterContainer.set(history);
LoginActionsCreator.autologin();
window.nekunoContainer = document.getElementById('root');
render(<Root history={history}/>, window.nekunoContainer);