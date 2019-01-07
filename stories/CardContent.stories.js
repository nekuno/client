import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import CardContent from '../src/js/components/ui/CardContent/CardContent.js';

storiesOf('CardContent', module)
    .add('with text', () => (
        <CardContent onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </CardContent>
    ))
    .add('with HTML', () => (
        <CardContent onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </CardContent>
    ));