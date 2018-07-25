import React from 'react';
import ComponentModel from '../../../js/components/ui/ComponentModel/ComponentModel.js';
import styles from '../../../js/components/ui/ComponentModel/ComponentModel.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ComponentModel component', () => {
    const mockFn = jest.fn();
    const componentModel = shallow(<ComponentModel onClickHandler={mockFn}>Lorem ipsum</ComponentModel>);

    it('should be defined', () => {
        expect(ComponentModel).toBeDefined();
    });
    it('should render correctly', () => {
        expect(componentModel).toMatchSnapshot();
    });
    it('ComponentModel click event', () => {
        componentModel.find(`.${styles.componentModel}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
