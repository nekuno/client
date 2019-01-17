import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import QuestionMatch from '../src/js/components/ui/QuestionMatch/QuestionMatch.js';

storiesOf('QuestionMatch', module)
    .add('with text', () => (
        <QuestionMatch onClickHandler={action('clicked')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.
        </QuestionMatch>
    ));