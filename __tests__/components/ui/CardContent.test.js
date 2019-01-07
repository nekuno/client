import React from 'react';
import CardContent from '../../../src/js/components/ui/CardContent/CardContent.js';
import styles from '../../../src/js/components/ui/CardContent/CardContent.scss';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Test CardContent component', () => {
    const mockFn = jest.fn();
    const cardcontent = shallow(<CardContent onClickHandler={mockFn}>Lorem ipsum</CardContent>);

    it('should be defined', () => {
        expect(cardcontent).toBeDefined();
    });
    it('should render correctly', () => {
        expect(cardcontent).toMatchSnapshot();
    });
    it('CardContent click event', () => {
        cardcontent.find(`.${styles.cardcontent}`).simulate('click');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
