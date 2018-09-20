import Vue from 'vue'

// Imports for ApolloCLient
import { ApolloClient } from 'apollo-client'
import { ApolloLink, concat } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import cookie from 'js-cookie'
import router from './router'

// Imports for ElementUI
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en' // needed to set fonts correctly
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue'

Vue.config.productionTip = false

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
})

// Append the authentication token to all requests going out from apollo
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = cookie.get('auth_token')
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  })
  return forward(operation)
})

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
}

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo)
Vue.use(ElementUI, {locale})

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app')
