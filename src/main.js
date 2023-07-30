import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import LoginPanel from './components/LoginPanel.vue';
import DashBoard from './components/DashBoard.vue';
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            bearerToken: 0,
            userData: null
        }
    },
    mutations: {
        setBareerToken(state, bearerToken) {
            state.bearerToken = bearerToken;
        },
        setUserInfo(state, newUserData) {
            state.userData = newUserData;
        },
    },
    getters: {
        getBareerToken(state) {
            return state.bearerToken;
        },
        getUserInfo(state) {
            return state.userData;
        },
    },
})

const routes = [
    { path: '/', component: LoginPanel },
    { path: '/dashboard', component: DashBoard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

app.use(store)
app.use(router);
app.mount('#app')


