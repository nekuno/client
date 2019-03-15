import React from 'react';
import CardTopData from '../../../src/js/components/ui/CardTopData/CardTopData.js';
import styles from '../../../src/js/components/ui/CardTopData/CardTopData.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CardTopData component', () => {
    const mockFn = jest.fn();
    const cardtopdata = shallow(<CardTopData onClickHandler={mockFn}>Lorem ipsum</CardTopData>);

    it('should be defined', () => {
        expect(cardtopdata).toBeDefined();
    });
    it('should render correctly', () => {
        expect(cardtopdata).toMatchSnapshot();
    });
    it('CardTopData click event', () => {
        cardtopdata.find(`.${styles.cardtopdata}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
