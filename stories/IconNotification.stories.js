import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IconNotification from '../src/js/components/ui/IconNotification/IconNotification.js';

storiesOf('IconNotification', module)
    .add('message icon, 5 messages', () => (
            <div style={{height: '100vh'}}>
                <IconNotification icon={'mail'} notifications={5} onClickHandler={action('clicked')}/>
            </div>
    ))
    .add('message icon, 55 message', () => (
            <div style={{height: '100vh'}}>
                <IconNotification icon={'mail'} notifications={55} onClickHandler={action('clicked')}/>
            </div>
    ))
    .add('messages icon, 100 messages', () => (
        <div style={{height: '100vh'}}>
            <IconNotification icon={'mail'} notifications={100} onClickHandler={action('clicked')}/>
        </div>
    ));