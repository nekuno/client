import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputSelectText from '../src/js/components/RegisterFields/InputSelectText/InputSelectText.js';

const options = [
    {
        id: "lorem",
        text: "Lorem"
    },
    {
        id: "ipsum",
        text: "Ipsum"
    },
    {
        id: "lorem-ipsum",
        text: "Lorem ipsum"
    },
    {
        id: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis"
    },
    {
        id: "perspiciatis",
        text: "perspiciatis"
    },
];

storiesOf('InputSelectText', module)
    .add('with options', () => (
        <InputSelectText onClickHandler={action('clicked')} options={options} placeholder={'Search option (e.g. Lorem)'} selectedLabel={'Your selection'}/>
    ));