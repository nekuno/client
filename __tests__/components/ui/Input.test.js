import React from 'react';
import Input from '../../../src/js/components/ui/Input/Input.js';
import styles from '../../../src/js/components/ui/Input/Input.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Input component', () => {
    const mockFn = jest.fn();
    const input = shallow(<Input placeholder={'Placeholder'} defaultValue={'Default value'} onChange={mockFn}/>);

    it('should be defined', () => {
        expect(Input).toBeDefined();
    });
    it('should render correctly', () => {
        expect(input).toMatchSnapshot();
    });
    it('Input click event', () => {
        input.find(`.${styles.input} input`).simulate('change');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
