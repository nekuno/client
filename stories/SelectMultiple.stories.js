import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import SelectMultiple from '../src/js/components/ui/SelectMultiple/SelectMultiple.js';

let labels = [
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
    }
];

let moreThan40Labels = [
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
        id: "lorem2",
        text: "Lorem2"
    },
    {
        id: "ipsum2",
        text: "Ipsum2"
    },
    {
        id: "lorem-ipsum2",
        text: "Lorem ipsum2"
    },
    {
        id: "sed-ut-perspiciatis2",
        text: "Sed ut perspiciatis2"
    },
    {
        id: "lorem3",
        text: "Lorem3"
    },
    {
        id: "ipsum3",
        text: "Ipsum3"
    },
    {
        id: "lorem-ipsum3",
        text: "Lorem ipsum3"
    },
    {
        id: "sed-ut-perspiciatis3",
        text: "Sed ut perspiciatis3"
    },
    {
        id: "lorem4",
        text: "Lorem4"
    },
    {
        id: "ipsum4",
        text: "Ipsum4"
    },
    {
        id: "lorem-ipsum4",
        text: "Lorem ipsum4"
    },
    {
        id: "sed-ut-perspiciatis4",
        text: "Sed ut perspiciatis4"
    },
    {
        id: "lorem5",
        text: "Lorem5"
    },
    {
        id: "ipsum5",
        text: "Ipsum5"
    },
    {
        id: "lorem-ipsum5",
        text: "Lorem ipsum5"
    },
    {
        id: "sed-ut-perspiciatis5",
        text: "Sed ut perspiciatis5"
    },
    {
        id: "lorem6",
        text: "Lorem6"
    },
    {
        id: "ipsum6",
        text: "Ipsum6"
    },
    {
        id: "lorem-ipsum6",
        text: "Lorem ipsum6"
    },
    {
        id: "sed-ut-perspiciatis6",
        text: "Sed ut perspiciatis6"
    },
    {
        id: "lorem7",
        text: "Lorem7"
    },
    {
        id: "ipsum7",
        text: "Ipsum7"
    },
    {
        id: "lorem-ipsum7",
        text: "Lorem ipsum7"
    },
    {
        id: "sed-ut-perspiciatis7",
        text: "Sed ut perspiciatis7"
    },
    {
        id: "lorem8",
        text: "Lorem8"
    },
    {
        id: "ipsum8",
        text: "Ipsum8"
    },
    {
        id: "lorem-ipsum8",
        text: "Lorem ipsum8"
    },
    {
        id: "sed-ut-perspiciatis8",
        text: "Sed ut perspiciatis8"
    },
    {
        id: "lorem9",
        text: "Lorem9"
    },
    {
        id: "ipsum9",
        text: "Ipsum9"
    },
    {
        id: "lorem-ipsum9",
        text: "Lorem ipsum9"
    },
    {
        id: "sed-ut-perspiciatis9",
        text: "Sed ut perspiciatis9"
    },
    {
        id: "lorem10",
        text: "Lorem10"
    },
    {
        id: "ipsum10",
        text: "Ipsum10"
    },
    {
        id: "lorem-ipsum10",
        text: "Lorem ipsum10"
    },
    {
        id: "sed-ut-perspiciatis10",
        text: "Sed ut perspiciatis10"
    },
    {
        id: "lorem11",
        text: "Lorem11"
    },
    {
        id: "ipsum11",
        text: "Ipsum11"
    },
    {
        id: "lorem-ipsum11",
        text: "Lorem ipsum11"
    },
    {
        id: "sed-ut-perspiciatis11",
        text: "Sed ut perspiciatis11"
    }
];

let values = ['lorem', 'lorem-ipsum'];

function handleClick(id) {
    const index = values.findIndex(value => value === id);
    if (index !== -1) {
        values.splice(index, 1);
    } else {
        values.push(id);
    }

    forceReRender();
}

storiesOf('SelectMultiple', module)
    .add('with short title', () => (
        <SelectMultiple values={values} labels={labels} title={'Foo'} onClickHandler={handleClick}/>
    ))
    .add('with long title', () => (
        <SelectMultiple values={values} labels={labels} title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante'} onClickHandler={handleClick}/>
    ))
    .add('with long title and more than 40 options', () => (
        <SelectMultiple values={values} labels={moreThan40Labels} title={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et elit ante'} onClickHandler={handleClick}/>
    ));