import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import CheckboxSquare from '../src/js/components/ui/CheckboxSquare/CheckboxSquare.js';

storiesOf('CheckboxSquare', module)
    .add('with text', () => (
        <CheckboxSquare onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </CheckboxSquare>
    ))
    .add('with HTML', () => (
        <CheckboxSquare onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </CheckboxSquare>
    ));