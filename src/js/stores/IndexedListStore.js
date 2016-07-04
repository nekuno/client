import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import BaseStore from './BaseStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationStore from '../stores/RecommendationStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import selectn from 'selectn';

export default class IndexedListStore extends BaseStore {

    _position = [];
    _ids = [];

    setInitial() {
        super.setInitial();
        this._position = [];
        this._ids = [];
    }

    setReceiving(action) {
        this._receivingClasses.forEach((classes) => {
           if (classes.request.type === action.type) {
               const listIds = this.getListIds(classes.request.listId, action);

               listIds.forEach((listId) => {
                   this._receiving[listId] = true;
               })

           }
        });
    }

    setReceivedSuccess(action) {
        this._receivingClasses.forEach((classes) => {
            if (classes.success.type === action.type) {
                const listIds = this.getListIds(classes.success.listId, action);

                listIds.forEach((listId) => {
                    this._receiving[listId] = false;
                    this._received[listId] = true;
                })
            }
        });
    }

    setReceivedError(action) {
        this._receivingClasses.forEach((classes) => {
            if (classes.error.type === action.type) {
                const listIds = this.getListIds(classes.error.listId, action);

                listIds.forEach((listId) => {
                    this._receiving[listId] = false;
                })
            }
        });
    }

    getListIds(listIdDefinition, action) {
        let listIds = [];
        if (listIdDefinition === null){
            return listIds;
        }
        switch (typeof listIdDefinition){
            case 'string':
                listIds.push(selectn(listIdDefinition, action));
                break;
            case 'object':
                if (listIdDefinition['array']){
                    let arrayIds = selectn(listIdDefinition['array'], action);
                    arrayIds.forEach((listId) => {
                        listIds.push(listId);
                    });
                }
        }

        return listIds;
    }

    getElements(listId) {
        return this._ids[listId] ? this._ids[listId] : [];
    }

    elementsReceived(listId) {
        return this._received[listId] ? this._received[listId] : false;
    }

    setPosition(listId, newPosition) {
        this._position[listId] = newPosition;
    }

    getPosition(listId) {
        return this._position[listId];
    }

    advancePosition(listId, number = 1) {
        this._position[listId] += number;
    }
}