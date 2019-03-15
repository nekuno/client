import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import SelectCollapsibleInterest from '../src/js/components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest.js';

storiesOf('SelectCollapsibleInterest', module)
    .add('with text', () => (
        <SelectCollapsibleInterest onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </SelectCollapsibleInterest>
    ))
    .add('with HTML', () => (
        <SelectCollapsibleInterest onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </SelectCollapsibleInterest>
    ));