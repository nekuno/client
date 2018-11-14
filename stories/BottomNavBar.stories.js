import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import BottomNavBar from '../src/js/components/BottomNavBar/BottomNavBar.js';

storiesOf('BottomNavBar', module)
    .add('with proposals as current', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomNavBar current={'proposals'}/>
        </div>
    ))
    .add('with persons as current and 1 notification', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomNavBar current={'persons'} notifications={1}/>
        </div>
    ))
    .add('with plans as current and 20 notifications', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomNavBar current={'plans'} notifications={20}/>
        </div>
    ))
    .add('with messages as current and 100 notifications', () => (
        <div>
            <div style={{height: '100vh'}}>Lorem ipsum</div>
            <BottomNavBar current={'messages'} notifications={100}/>
        </div>
    ));