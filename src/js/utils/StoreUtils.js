import shallowEqual from 'react-pure-render/shallowEqual';
import selectn from 'selectn';

export function isInBag(bag, id, fields) {
  let item = bag[id];
  if (!bag[id]) {
    return false;
  }

  if (fields) {
    return fields.every(field => item.hasOwnProperty(field));
  } else {
    return true;
  }
}

export function mergeIntoBag(bag, entities) {
  for (let id in entities) {
    if (!entities.hasOwnProperty(id)) {
      continue;
    }

    if (!bag.hasOwnProperty(id)) {
      bag[id] = entities[id];
    } else if (!shallowEqual(bag[id], entities[id])) {
      bag[id] = Object.assign({}, bag[id], entities[id]);
    }
  }
}

export function removeFromBag(bag, entities) {
  for (let id in entities) {
    if (!entities.hasOwnProperty(id)) {
      continue;
    }

    if (bag.hasOwnProperty(id)) {
      delete bag[id];
    }
  }
}

export function getValidationErrors(error) {
  let validationErrors =  selectn('validationErrors', error) || {};
  let displayErrors = '';

  Object.keys(validationErrors).forEach(key => {
      if (typeof validationErrors[key] === 'string') {
          displayErrors += validationErrors[key] + '<br/>';
      } else if (Array.isArray(validationErrors[key])) {
          displayErrors += validationErrors[key].map(error => error + '<br/>');
      }
  });

  return displayErrors;
}