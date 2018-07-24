import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Chip from '../components/ui/Chip/Chip.js';

storiesOf('Chip', module)
    .add('with cancel handler and unselected', () => (
        <Chip onClickHandler={action('clicked')}
              onCancelHandler={action('cancelled')}
              text="Lorem ipsum dolor sit amet"
              selected={false}
        />
    ))
    .add('with cancel handler and selected', () => (
        <Chip
            onClickHandler={action('clicked')}
            onCancelHandler={action('cancelled')}
            text="Lorem ipsum dolor sit amet"
            selected={true}
        />
    ))
    .add('with cancel handler and long text', () => (
        <Chip onClickHandler={action('clicked')}
              onCancelHandler={action('cancelled')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
        />
    ))
    .add('without cancel handler and unselected', () => (
        <Chip onClickHandler={action('clicked')}
              text="Lorem ipsum dolor sit amet"
              selected={false}
        />
    ))
    .add('without cancel handler and selected', () => (
        <Chip onClickHandler={action('clicked')}
              text="Lorem ipsum dolor sit amet"
              selected={true}
        />
    ))
    .add('without cancel handler and long text', () => (
        <Chip onClickHandler={action('clicked')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
        />
    ));