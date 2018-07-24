import React from 'react';
import Chip from '../../../js/components/ui/Chip/Chip.js';
import styles from '../../../js/components/ui/Chip/Chip.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Chip component', () => {
    const mockFn = jest.fn();
    const chipUnselected = shallow((<Chip onClickHandler={mockFn} text={'Lorem ipsum dolor sit amet'} selected={false} />));
    const chipSelected = shallow((<Chip onClickHandler={mockFn} text={'Lorem ipsum dolor sit amet'} selected={true} />));

    it('should be defined', () => {
        expect(Chip).toBeDefined();
    });
    it('should render correctly', () => {
        expect(chipUnselected).toMatchSnapshot();
        expect(chipSelected).toMatchSnapshot();
    });
    it('Chip unselected click event', () => {
        chipUnselected.find(`.${styles.chip}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('Chip selected click event', () => {
        chipSelected.find(`.${styles.chip}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
