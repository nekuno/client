import React from 'react';
import Select from '../../../src/js/components/ui/Select/Select.js';
import styles from '../../../src/js/components/ui/Select/Select.scss';
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

describe('Test Select component', () => {
    const mockFn = jest.fn();
    const select = shallow(<Select values={['lorem', 'lorem-ipsum']} labels={labels} title={'Foo'} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(select).toBeDefined();
    });
    it('should render correctly', () => {
        expect(select).toMatchSnapshot();
    });
});
