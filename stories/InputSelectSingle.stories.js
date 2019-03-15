import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import InputSelectSingle from '../src/js/components/ui/InputSelectSingle/InputSelectSingle.js';

storiesOf('InputSelectSingle', module)
    .add('with text', () => (
        <InputSelectSingle onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </InputSelectSingle>
    ))
    .add('with HTML', () => (
        <InputSelectSingle onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </InputSelectSingle>
    ));