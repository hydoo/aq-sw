import {createApp} from 'vue'
import App from './App.vue'
import NaiveUi from 'naive-ui'
import {setupRouter} from './router/router';
import {setStore} from "./store/store";

async function projectRun() {

    const app = createApp(App)

    app.use(NaiveUi)

    setStore(app)

    await setupRouter(app);

    app.mount('#app', true);

}

void projectRun();



