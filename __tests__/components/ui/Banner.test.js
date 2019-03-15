import React from 'react';
import Banner from '../../../src/js/components/ui/Banner/Banner.js';
import styles from '../../../src/js/components/ui/Banner/Banner.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test Banner component', () => {
    const mockFn = jest.fn();
    const mockFnSkip = jest.fn();
    const banner = shallow((<Banner title={'Title'} description={'Description'} skipText={'skip'} buttonText={'Ok'} icon={'icon'} onClickHandler={mockFn} onSkipHandler={mockFnSkip} />));

    it('should be defined', () => {
        expect(Banner).toBeDefined();
    });
    it('should render correctly', () => {
        expect(banner).toMatchSnapshot();
    });
    it('Banner click event on text wrapper', () => {
        banner.find(`.${styles.textWrapper}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('Banner click event on button', () => {
        banner.find(`.${styles.buttonWrapper}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('Banner click event on icon', () => {
        banner.find(`.${styles.icon}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('Banner skip event', () => {
        banner.find(`.${styles.skipLink}`).simulate('click');
        expect(mockFnSkip).toHaveBeenCalledTimes(1);
    });
});
