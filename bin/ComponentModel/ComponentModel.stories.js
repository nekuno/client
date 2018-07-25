import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import ComponentModel from '../components/ui/ComponentModel/ComponentModel.js';

storiesOf('ComponentModel', module)
    .add('with text', () => (
        <ComponentModel onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </ComponentModel>
    ))
    .add('with HTML', () => (
        <ComponentModel onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </ComponentModel>
    ));