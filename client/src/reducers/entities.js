import {
  RECEIVE_ALL_DATA,
  RECEIVE_NEW_DATA,
  RECEIVE_REMOVE_DATA,
  RECEIVE_UPDATE_DATA,
  REQUEST_ALL_DATA,
  REQUEST_SAVE_DATA,
} from '../actions/api';
import { DEAUTHENTICATED } from '../actions/session';

const { REACT_APP_REST_URL: ENDPOINT } = process.env;

const Models = {
  link: data => ({
    ...data,
    get createdAt() {
      return data.meta ? data.meta.created : null;
    },
    get shortURL() {
      return `${ENDPOINT || ''}/link/${data.id}`;
    },
  }),
};

const addNewModel = (models, newModel) => [
  newModel,
  ...models.filter(({ id }) => id !== newModel.id),
];

const updateModel = (models, updatedModel) =>
  models.map(model => {
    if (model.id === updatedModel.id) {
      return updatedModel;
    }
    return model;
  });

const removeModel = (models, removedId) =>
  models.filter(({ id }) => id !== removedId);

const initialEntityState = {
  isFetching: false,
  isSaving: false,
  models: [],
};

export const initialState = {
  link: initialEntityState,
  // ... other entities
};

const entity = (state = initialState, { type, entity, data: rawData }) => {
  const entityState = state[entity];
  const EntityModel = Models[entity];

  switch (type) {
    case REQUEST_ALL_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isFetching: true,
        },
      };

    case RECEIVE_ALL_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isFetching: false,
          models: rawData.map(data => EntityModel(data)),
        },
      };

    case REQUEST_SAVE_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isSaving: true,
        },
      };

    case RECEIVE_NEW_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isSaving: false,
          models: addNewModel(entityState.models, EntityModel(rawData)),
        },
      };

    case RECEIVE_UPDATE_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isSaving: false,
          models: updateModel(entityState.models, EntityModel(rawData)),
        },
      };

    case RECEIVE_REMOVE_DATA:
      return {
        ...state,
        [entity]: {
          ...entityState,
          isSaving: false,
          models: removeModel(entityState.models, rawData.id),
        },
      };

    case DEAUTHENTICATED:
      return initialState;

    default:
      return state;
  }
};

export default entity;
