import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links'
import Chip from '../src/js/components/ui/Chip/Chip.js';

storiesOf('Chip', module)
    .add('unselected', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected')}
              text="Lorem"
              selected={false}
        />
    ))
    .add('selected', () => (
        <Chip
            onClickHandler={linkTo('Chip', 'unselected')}
            text="Lorem"
            selected={true}
        />
    ))
    .add('unselected with medium text', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with medium text')}
              text="Lorem ipsum dolor sit amet"
        />
    ))
    .add('selected with medium text', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with medium text')}
              text="Lorem ipsum dolor sit amet"
              selected={true}
        />
    ))
    .add('unselected with long text', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with long text')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
        />
    ))
    .add('selected with long text', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with long text')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              selected={true}
        />
    ));
