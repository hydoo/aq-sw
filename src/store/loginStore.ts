import {defineStore} from "pinia";

interface LoginUserInfo {
    username: string,
    password: string
}

export const loginStore = defineStore({
    id: 'sw-login-store',
    state: (): LoginUserInfo => ({
        username: '',
        password: ''
    }),
    getters: {
        getUserName(): string {
            return this.username;
        },
        getPassWord(): string {
            return this.password;
        },


    },
    actions: {
        setUserName(v: string): void {
            this.username = v;
        },
        setPassWord(v: string): void {
            this.password = v;
        },
        // 登录
        async login() {
            let userName = this.username;
            let passWord = this.password;
            if (userName == 'admin' && passWord == '123456') {
                return Promise.resolve({
                    userName, passWord
                });
            } else {
                return Promise.reject('');
            }
        },

        // 登出
        async logout() {
            return Promise.resolve('');
        },


    },


});