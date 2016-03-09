import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ChatMessageStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._messages = {};
        this._noMessages = false;
    }

    _registerToActions(action) {
        switch (action.type) {

            case ActionTypes.CHAT_MESSAGES:
                this._addMessages(action.messages);
                this.emitChange();
                break;

            case ActionTypes.CHAT_NO_MESSAGES:
                this._noMessages = action.noMessages;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _addMessages(messages) {
        messages.forEach((message) => {
            if (!this._messages[message.id]) {
                message.createdAt = new Date(message.createdAt);
                this._messages[message.id] = message;
            }
        })
    }

    noMessages() {
        return this._noMessages;
    }

    getAll() {
        return this._messages;
    }

    getAllForUser(id) {

        let userMessages = [];

        for (var messageId in this._messages) {
            let message = this._messages[messageId];
            if (message.user_from.id === parseInt(id) || message.user_to.id === parseInt(id)) {
                userMessages.push(message);
            }
        }

        userMessages.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
                return -1;
            } else if (a.createdAt > b.createdAt) {
                return 1;
            }
            return 0;
        });

        return userMessages;
    }

}

export default new ChatMessageStore();