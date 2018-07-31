import React from 'react';
import RoundedImage from '../../../js/components/ui/RoundedImage/RoundedImage.js';
import styles from '../../../js/components/ui/RoundedImage/RoundedImage.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test RoundedImage component', () => {
    const mockFn = jest.fn();
    const roundedImage = shallow(<RoundedImage url={'http://via.placeholder.com/300x300'} size={'large'} onClickHandler={mockFn}/>);

    it('should be defined', () => {
        expect(RoundedImage).toBeDefined();
    });
    it('should render correctly', () => {
        expect(roundedImage).toMatchSnapshot();
    });
    it('RoundedImage click event', () => {
        roundedImage.find(`.${styles.roundedImage}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
