import React from 'react';
import StepsBar from '../../../src/js/components/ui/StepsBar/StepsBar.js';
import styles from '../../../src/js/components/ui/StepsBar/StepsBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test StepsBar component', () => {
    const mockFn = jest.fn();
    const stepsBar = shallow(<StepsBar totalSteps={3} currentStep={0} continueText={'Continue'} cantContinueText={'You cannot continue'} canContinue={true} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(StepsBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(stepsBar).toMatchSnapshot();
    });
    it('StepsBar click event', () => {
        stepsBar.find(`.${styles.stepsBar}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
