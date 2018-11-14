import React from 'react';
import RoundedIcon from '../../../src/js/components/ui/RoundedIcon/RoundedIcon.js';
import styles from '../../../src/js/components/ui/RoundedIcon/RoundedIcon.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test RoundedIcon component', () => {
    const mockFn = jest.fn();
    const roundedIcon = shallow(<RoundedIcon icon='facebook' size='medium' onClickHandler={mockFn}/>);
    const disabledRoundedIcon = shallow(<RoundedIcon disabled={true} icon='facebook' size='medium' onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(RoundedIcon).toBeDefined();
    });
    it('should render correctly', () => {
        expect(roundedIcon).toMatchSnapshot();
        expect(disabledRoundedIcon).toMatchSnapshot();
    });
    it('RoundedIcon click event', () => {
        roundedIcon.find(`.${styles.roundedIcon}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('RoundedIcon disabled click event', () => {
        disabledRoundedIcon.find(`.${styles.roundedIcon}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(0);
    });
});
