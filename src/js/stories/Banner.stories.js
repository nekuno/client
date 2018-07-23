import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Banner from '../components/ui/Banner/Banner.js';

storiesOf('Banner', module)
    .add('with text', () => (
        <Banner onClickHandler={action('clicked')}
                onSkipHandler={action('skipped')}
                title={'Banner text'}
                description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.'}
                buttonText={'Lorem ipsum'}
                skipText={'Lorem'}
        />
    ))
    .add('with icon', () => (
        <Banner onClickHandler={action('clicked')}
                onSkipHandler={action('skipped')}
                title={'Banner text'}
                description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante.'}
                buttonText={'Lorem ipsum'}
                icon={'comments'}
                skipText={'Lorem'}
        />
    ));