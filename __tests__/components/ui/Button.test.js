import React from 'react';
import Button from '../../../src/js/components/ui/Button/Button.js';
import styles from '../../../src/js/components/ui/Button/Button.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Button component', () => {
    const mockFn = jest.fn();
    const button = shallow(<Button onClickHandler={mockFn}>Lorem ipsum</Button>);

    it('should be defined', () => {
        expect(Button).toBeDefined();
    });
    it('should render correctly', () => {
        expect(button).toMatchSnapshot();
    });
    it('Button click event', () => {
        button.find(`.${styles.button}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
