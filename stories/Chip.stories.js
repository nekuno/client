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
    .add('unselected with medium text (blue)', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with medium text (blue)')}
              text="Lorem ipsum dolor sit amet"
              color="blue"
        />
    ))
    .add('selected with medium text (blue)', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with medium text (blue)')}
              text="Lorem ipsum dolor sit amet"
              color="blue"
              selected={true}
        />
    ))
    .add('unselected with long text (pink)', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with long text (pink)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="pink"
        />
    ))
    .add('selected with long text (pink)', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with long text (pink)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="pink"
              selected={true}
        />
    ))
    .add('unselected with long text (green)', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with long text (green)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="green"
        />
    ))
    .add('selected with long text (green)', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with long text (green)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="green"
              selected={true}
        />
    ))
    .add('unselected with long text (purple)', () => (
        <Chip onClickHandler={linkTo('Chip', 'selected with long text (purple)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="purple"
        />
    ))
    .add('selected with long text (purple)', () => (
        <Chip onClickHandler={linkTo('Chip', 'unselected with long text (purple)')}
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante."
              color="purple"
              selected={true}
        />
    ));
