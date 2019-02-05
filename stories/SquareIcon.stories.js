import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import SquareIcon from '../src/js/components/ui/SquareIcon/SquareIcon.js';

storiesOf('SquareIcon', module)
    .add('with text', () => (
        <SquareIcon onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </SquareIcon>
    ))
    .add('with HTML', () => (
        <SquareIcon onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </SquareIcon>
    ));