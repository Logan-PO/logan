import { createStore, applyMiddleware, compose } from 'redux';

const composeEnhancers =
    typeof window === 'object' &&
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose);

export const store = createStore()

/*
export function configureStore() {
    const middlewares = [];
    const store = createStore(
        null,
        {},
        composeEnhancers(applyMiddleware(...middlewares))
    );
    return store;
}

export default configureStore;
*/
