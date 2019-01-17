import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import QuestionPartialMatch from '../src/js/components/ui/QuestionPartialMatch/QuestionPartialMatch.js';

storiesOf('QuestionPartialMatch', module)
    .add('with text', () => (
        <QuestionPartialMatch onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </QuestionPartialMatch>
    ))
    .add('with HTML', () => (
        <QuestionPartialMatch onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </QuestionPartialMatch>
    ));