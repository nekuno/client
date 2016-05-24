import { Dispatcher } from 'flux';
import ActionTypes from '../constants/ActionTypes';
import LoginStore from '../stores/LoginStore';
//import LocaleStore from '../stores/LocaleStore';

const flux = new Dispatcher();

const guest_forbidden = [ActionTypes.EDIT_PROFILE, ActionTypes.UPDATE_THREAD, ActionTypes.CREATE_THREAD, ActionTypes.CONNECT_ACCOUNT,
                            ActionTypes.LIKE_CONTENT, ActionTypes.LIKE_USER, ActionTypes.UNLIKE_CONTENT, ActionTypes.UNLIKE_USER,
                            ActionTypes.BLOCK_USER, ActionTypes.UNBLOCK_USER, ActionTypes.REGISTER_USER, ActionTypes.ANSWER_QUESTION,
                            ActionTypes.SKIP_QUESTION, ActionTypes.DELETE_THREAD];
const guest_username = 'guest';

export function register(callback) {
    return flux.register(callback);
}

export function waitFor(ids) {
    return flux.waitFor(ids);
}

// Some Flux examples have methods like `handleViewAction`
// or `handleServerAction` here. They are only useful if you
// want to have extra pre-processing or logging for such actions,
// but I found no need for them.

/**
 * Dispatches a single action.
 */
export function dispatch(type, action = {}) {
    if (!type) {
        throw new Error('You forgot to specify type.');
    }

    if (LoginStore.user && LoginStore.user.username === guest_username && guest_forbidden.indexOf(type) > -1){
        let message = 'Esta función está disponible solo para usuarios registrados. ¡Mejora tu experiencia con nosotros!';
        //if (LocaleStore.locale == 'en'){
        //    message = 'This feature is available only for registered users. Improve your experience with us!';
        //}
        nekunoApp.alert(message);
        throw new Error(message);
    }

    // In production, thanks to DefinePlugin in webpack.config.production.js,
    // this comparison will turn `false`, and UglifyJS will cut logging out
    // as part of dead code elimination.
    if (process.env.NODE_ENV !== 'production') {
        // Logging all actions is useful for figuring out mistakes in code.
        // All data that flows into our application comes in form of actions.
        // Actions are just plain JavaScript objects describing “what happened”.
        // Think of them as newspapers.
        if (action.error) {
            console.error(type, action);
        } else {
            console.log(type, action);
        }
    }
    flux.dispatch({type, ...action});
}

/**
 * Dispatches three actions for an async operation represented by promise.
 */
export function dispatchAsync(promise, types, action = {}) {
    const { request, success, failure } = types;

    dispatch(request, action);
    promise.then(
        response => dispatch(success, {...action, response}),
        error => dispatch(failure, {...action, error})
    );

    return promise;
}
