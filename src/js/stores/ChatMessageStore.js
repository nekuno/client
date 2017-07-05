import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ChatMessageStore extends BaseStore {

    setInitial() {
        this._messages = {};
        this._fresh = {};
        this._noMessages = false;
        this._noMoreMessages = {};
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.CHAT_MESSAGES:
                this._addMessages(action.messages, action.fresh);
                this.emitChange();
                break;

            case ActionTypes.CHAT_NO_MESSAGES:
                this._noMessages = action.noMessages;
                this.emitChange();
                break;

            case ActionTypes.CHAT_NO_MORE_MESSAGES:
                this._noMoreMessages[action.userId] = true;
                this.emitChange();
                break;

            case ActionTypes.CHAT_MARK_AS_READED:
                for (var messageId in this._messages) {
                    let message = this._messages[messageId];
                    if (message.user_from.id === action.userId) {
                        message.readed = true;
                    }
                }
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _addMessages(messages, fresh) {
        messages.forEach((message) => {
            message.createdAt = new Date(message.createdAt);
            message.readed = message.readed === 1;
            this._messages[message.id] = message;
            let user = message.user.id === message.user_from.id ? message.user_to : message.user_from;
            this._fresh[user.id] = fresh;
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

        this._sortMessagesByDate(userMessages);

        return userMessages;
    }

    getAllForSlug(slug)
    {
        let userMessages = [];

        for (var messageId in this._messages) {
            let message = this._messages[messageId];
            if (message.user_from.slug === slug || message.user_to.slug === slug) {
                userMessages.push(message);
            }
        }

        this._sortMessagesByDate(userMessages);

        return userMessages;
    }

    _sortMessagesByDate(messages)
    {
        messages.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
                return -1;
            } else if (a.createdAt > b.createdAt) {
                return 1;
            }
            return 0;
        });
    }

    isFresh(id) {
        return this._fresh[id] && this._fresh[id] === true;
    }

    noMoreMessages(id) {
        return this._noMoreMessages[id] && this._noMoreMessages[id] === true;
    }

}

export default new ChatMessageStore();