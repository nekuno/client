import React from 'react';
import InputTag from '../../../src/js/components/RegisterFields/InputTag/InputTag.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputTag component', () => {
    const mockChangeFn = jest.fn();
    const mockClickFn = jest.fn();
    const tags = ["Lorem", "Ipsum", "Lorem ipsum", "Sed ut perspiciatis", "perspiciatis"];

    const inputTag = shallow(<InputTag onClickHandler={mockClickFn} onChangeHandler={mockChangeFn} placeholder={"Foo"} tags={tags}/>);

    it('should be defined', () => {
        expect(InputTag).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputTag).toMatchSnapshot();
    });
});
