import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import IconCollapsible from '../src/js/components/ui/IconCollapsible/IconCollapsible.js';

storiesOf('IconCollapsible', module)
    .add('with text', () => (
        <IconCollapsible onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </IconCollapsible>
    ))
    .add('with HTML', () => (
        <IconCollapsible onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </IconCollapsible>
    ));