import React from 'react';
import InputSelectText from '../../../src/js/components/RegisterFields/InputSelectText/InputSelectText.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputSelectText component', () => {
    const mockFn = jest.fn();
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

    const inputSelectText = shallow(<InputSelectText onClickHandler={mockFn} placeholder={"Foo"} options={options}/>);

    it('should be defined', () => {
        expect(InputSelectText).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputSelectText).toMatchSnapshot();
    });
});
