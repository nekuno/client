import { dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {

    open: () => {
        dispatch(ActionTypes.LEFT_PANEL_OPEN);
    },

    close: () => {
        dispatch(ActionTypes.LEFT_PANEL_CLOSE);
    }
}
