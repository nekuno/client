import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createHashHistory } from 'history';
import Root from './Root';
import './vendor/init';

const history = createHashHistory();
render(<Root history={history}/>, document.getElementById('root'));