import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import CheckboxRounded from '../src/js/components/ui/CheckboxRounded/CheckboxRounded.js';

storiesOf('CheckboxRounded', module)
    .add('with text', () => (
        <CheckboxRounded onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </CheckboxRounded>
    ))
    .add('with HTML', () => (
        <CheckboxRounded onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </CheckboxRounded>
    ));