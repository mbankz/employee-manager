import { createStore, applyMiddleware } from 'redux'
import reducer from './ducks/reducer'
import promiseMiddleware from 'redux-promise-middleware'

let middleware = promiseMiddleware();

export default createStore(reducer, applyMiddleware(middleware));