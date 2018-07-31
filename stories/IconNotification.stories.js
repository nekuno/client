import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IconNotification from '../src/js/components/ui/IconNotification/IconNotification.js';

storiesOf('IconNotification', module)
    .add('message icon, 5 messages', () => (
        <IconNotification icon={'message'} notifications={5} onClickHandler={action('clicked')}/>
    ))
    .add('message icon, 55 message', () => (
        <IconNotification icon={'message'} notifications={55} onClickHandler={action('clicked')}/>
    ))
    .add('messages icon, 100 messages', () => (
        <IconNotification icon={'message'} notifications={100} onClickHandler={action('clicked')}/>
    ));