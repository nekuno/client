import React from 'react';
import InputSelectSingle from '../../../src/js/components/ui/InputSelectSingle/InputSelectSingle.js';
import styles from '../../../src/js/components/ui/InputSelectSingle/InputSelectSingle.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test InputSelectSingle component', () => {
    const mockFn = jest.fn();
    const inputselectsingle = shallow(<InputSelectSingle onClickHandler={mockFn}>Lorem ipsum</InputSelectSingle>);

    it('should be defined', () => {
        expect(inputselectsingle).toBeDefined();
    });
    it('should render correctly', () => {
        expect(inputselectsingle).toMatchSnapshot();
    });
    it('InputSelectSingle click event', () => {
        inputselectsingle.find(`.${styles.inputselectsingle}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
