import React from 'react';
import InputSelectImage from '../../../src/js/components/RegisterFields/InputSelectImage/InputSelectImage.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputSelectImage component', () => {
    const mockFn = jest.fn();
    const options = [
        {
            id: "lorem",
            text: "Lorem",
            image: "http://via.placeholder.com/300x300"
        },
        {
            id: "ipsum",
            text: "Ipsum",
            image: "http://via.placeholder.com/300x300"
        },
        {
            id: "lorem-ipsum",
            text: "Lorem ipsum",
            image: "http://via.placeholder.com/300x300"
        },
        {
            id: "sed-ut-perspiciatis",
            text: "Sed ut perspiciatis",
            image: "http://via.placeholder.com/300x300"
        },
        {
            id: "perspiciatis",
            text: "perspiciatis",
            image: "http://via.placeholder.com/300x300"
        },
    ];

    const inputSelectImage = shallow(<InputSelectImage options={options} placeholder={"Foo"} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(inputSelectImage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputSelectImage).toMatchSnapshot();
    });
});
