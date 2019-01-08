import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import AnswerQuestionCard from '../src/js/components/ui/AnswerQuestionCard/AnswerQuestionCard.js';

storiesOf('AnswerQuestionCard', module)
    .add('with text', () => (
        <AnswerQuestionCard onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </AnswerQuestionCard>
    ))
    .add('with HTML', () => (
        <AnswerQuestionCard onClickHandler={action('clicked')}>
            <div>Lorem ipsum</div>
            <br/>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.</div>
        </AnswerQuestionCard>
    ));