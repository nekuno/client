import React from 'react';
import ProgressBar from '../../../js/components/ui/ProgressBar/ProgressBar.js';
import styles from '../../../js/components/ui/ProgressBar/ProgressBar.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test ProgressBar component', () => {
    const mockFn = jest.fn();
    const progressBar = shallow(<ProgressBar title="Lorem ipsum" percentage={15} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(ProgressBar).toBeDefined();
    });
    it('should render correctly', () => {
        expect(progressBar).toMatchSnapshot();
    });
    it('ProgressBar click event', () => {
        progressBar.find(`.${styles.progressBarWrapper}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
