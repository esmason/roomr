import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from '../imports/ui/components/app'
import reducer from '../imports/ui/reducers'


const store = createStore(reducer)

Meteor.startup(() => {

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('render-target')
)
})
