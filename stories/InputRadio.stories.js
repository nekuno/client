import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import InputRadio from '../src/js/components/ui/InputRadio/InputRadio.js';

let checked = false;

function onClick() {
    checked = !checked;
    forceReRender();
}


storiesOf('InputRadio', module)
    .add('with short text', () => (
        <InputRadio value={'lorem'} text={"Lorem ipsum"} checked={checked} onClickHandler={onClick}/>
    ))
    .add('with long text', () => (
        <InputRadio value={'lorem-ipsum'} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"} checked={checked} onClickHandler={onClick}/>
    ));