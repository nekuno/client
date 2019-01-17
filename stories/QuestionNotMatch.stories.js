import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import QuestionNotMatch from '../src/js/components/ui/QuestionNotMatch/QuestionNotMatch.js';

storiesOf('QuestionNotMatch', module)
    .add('with text', () => (
        <QuestionNotMatch onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </QuestionNotMatch>
    ))
    .add('with HTML', () => (
        <QuestionNotMatch onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </QuestionNotMatch>
    ));