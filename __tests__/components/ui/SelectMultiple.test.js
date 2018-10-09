import React from 'react';
import SelectMultiple from '../../../src/js/components/ui/SelectMultiple/SelectMultiple.js';
import styles from '../../../src/js/components/ui/SelectMultiple/SelectMultiple.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const labels = [
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

describe('Test SelectMultiple component', () => {
    const mockFn = jest.fn();
    const select = shallow(<SelectMultiple values={['lorem', 'lorem-ipsum']} labels={labels} title={'Foo'} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(select).toBeDefined();
    });
    it('should render correctly', () => {
        expect(select).toMatchSnapshot();
    });
});
