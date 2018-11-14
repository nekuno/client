import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links'
import Select from '../src/js/components/ui/Select/Select.js';

const options = [
    {
        key: "lorem",
        text: "Lorem"
    },
    {
        key: "ipsum",
        text: "Ipsum"
    },
    {
        key: "lorem-ipsum",
        text: "Lorem ipsum"
    },
    {
        key: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis"
    }
];

storiesOf('Select', module)
    .add('with default option', () => (
        <Select title={'Lorem ipsum'} options={options} defaultOption={"lorem"} onClickHandler={action('selected')}/>
    ))
    .add('without default option', () => (
        <Select title={'Lorem ipsum'} options={options} onClickHandler={action('selected')}/>
    ));