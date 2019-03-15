import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputSelectImage from '../src/js/components/RegisterFields/InputSelectImage/InputSelectImage.js';

const options = [
    {
        id: "lorem",
        text: "Lorem",
        picture: "http://via.placeholder.com/84x84"
    },
    {
        id: "ipsum",
        text: "Ipsum",
        picture: "http://via.placeholder.com/84x84"
    },
    {
        id: "lorem-ipsum",
        text: "Lorem ipsum",
        picture: "http://via.placeholder.com/84x84"
    },
    {
        id: "sed-ut-perspiciatis",
        text: "Sed ut perspiciatis",
        picture: "http://via.placeholder.com/84x84"
    },
    {
        id: "perspiciatis",
        text: "perspiciatis",
        picture: "http://via.placeholder.com/84x84"
    },
    {
        id: "ut-perspiciatis",
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        picture: "http://via.placeholder.com/84x84"
    },
];

storiesOf('InputSelectImage', module)
    .add('with options', () => (
        <InputSelectImage onClickHandler={action('clicked')} options={options} placeholder={'Search option (e.g. Lorem)'}/>
    ));