import Vue from "vue";
import App from "./App.vue";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.config.productionTip = false;

require("@/main.scss");

Vue.use(VueApollo);

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: "https://pangaea-interviews.now.sh/api/graphql",
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  el: "#app",
  // inject apolloProvider here like vue-router or vuex
  apolloProvider,
  render: (h) => h(App),
});
