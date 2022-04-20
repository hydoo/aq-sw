import type {UserConfig, ConfigEnv} from 'vite';
import {loadEnv, defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue'

import {resolve} from "path";


const root = process.cwd();

function pathResolve(dir: string) {
    return resolve(root, '.', dir);
}


// export default defineConfig({
//
//     plugins: [vue()],
//     resolve: {
//         alias: [{
//             find: /\/#\//,
//             replacement: pathResolve('types') + '/',
//         }, {
//             find: '@',
//             replacement: pathResolve('src') + '/',
//         }],
//         dedupe: ['vue'],
//     },
//     server: {
//         port: 7001,
//
//     },
//
// })


function wrapperEnv(envConf: Record<string, string>) {
    const ret: any = {};

    for (const envName of Object.keys(envConf)) {
        let realName: any = envConf[envName].replace(/\\n/g, '\n');
        realName = realName === 'true' ? true : realName === 'false' ? false : realName;

        if (envName === 'VITE_PORT') {
            realName = Number(realName);
        }
        if (envName === 'VITE_PROXY') {
            try {
                realName = JSON.parse(realName);
            } catch (error) {
            }
        }
        ret[envName] = realName;
        process.env[envName] = realName;
    }
    return ret;

}

export default ({command, mode}: ConfigEnv): UserConfig => {

    const env = loadEnv(mode, root);
    const viteEnv = wrapperEnv(env);
    const {VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, OUTPUT_DIR} = viteEnv;

    return {
        base: VITE_PUBLIC_PATH,
        esbuild: {},
        plugins: [vue()],
        resolve: {
            alias: [
                {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/',
                }, {
                    find: '@',
                    replacement: pathResolve('src') + '/',
                },
            ],
            dedupe: ['vue'],
        },
        server: {
            host: true,
            port: VITE_PORT,
            // proxy: createProxy(VITE_PROXY),
            // proxy: {
            //     '/api': {
            //         target: '',
            //         changeOrigin: true,
            //         rewrite: (path) => path.replace(/^\/api/, '/api/v1')
            //     }
            // }
        },
        optimizeDeps: {
            include: [],
            exclude: ['vue-demi'],
        },
        build: {
            target: 'es2015',
            outDir: OUTPUT_DIR,
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_console: VITE_DROP_CONSOLE,
                },
            },
            brotliSize: false,
            chunkSizeWarningLimit: 2000,
        },

    }
}
