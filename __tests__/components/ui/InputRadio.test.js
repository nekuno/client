import React from 'react';
import InputRadio from '../../../src/js/components/ui/InputRadio/InputRadio.js';
import styles from '../../../src/js/components/ui/InputRadio/InputRadio.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputRadio component', () => {
    const mockFn = jest.fn();
    const inputRadio = shallow(<InputRadio value={'lorem'} text={'Lorem'} checked={true} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(inputRadio).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputRadio).toMatchSnapshot();
    });
    it('InputRadio click event', () => {
        inputRadio.find(`.${styles.inputRadio}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
