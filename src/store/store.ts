import type {App} from 'Vue';
import {createPinia} from "pinia";

const store = createPinia();

export function setStore(app: App<Element>) {

    app.use(store)

}

export {store}

