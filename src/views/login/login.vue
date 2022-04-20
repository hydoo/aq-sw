<template>
  <n-space vertical>
    <n-input-group>
      <n-input-group-label>账号</n-input-group-label>
      <n-input v-model:value="userName" :style="{ width: '200px' }"/>
    </n-input-group>
    <n-input-group>
      <n-input-group-label>密码</n-input-group-label>
      <n-input v-model:value="passWord" :style="{ width: '200px' }"/>
    </n-input-group>
    <n-input-group>
      <n-button type="primary" ghost @click="btnLogin">
        登录
      </n-button>
    </n-input-group>
  </n-space>
</template>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
// import {useMessage} from "naive-ui";
import {PageEnum} from "@/enum/pageEnum";
import {loginStore} from "@/store/loginStore";


// interface FormState {
//   username: string;
//   password: string;
// }

// const $message = useMessage();
const router = useRouter();
const route = useRoute();

const store = loginStore();


const userName = computed<string>({
  get: () => store.getUserName,
  set: (v: string) => store.setUserName(v)
});

const passWord = computed<string>({
  get: () => store.getPassWord,
  set: (v: string) => store.setPassWord(v)
});

// 点击登录按钮
const btnLogin = (e: any) => {
  e.preventDefault();
  // $message.loading('正在登录...');

  store.login().then(e => {
    // $message.success('系统登陆成功！');

    const toPath = decodeURIComponent((route.query?.redirect || '/') as string);


    if (route.name === PageEnum.BASE_LOGIN_NAME) {
      // router.replace(PageEnum.BASE_PORTAL_NAME)
      // router.replace(PageEnum.BASE_MAP_NAME)
      router.replace(PageEnum.BASE_MAP_QINGHAI_NAME)


    } else {
      // router.replace(toPath);
    }
  }).catch(e => {

    // $message.error('系统登录失败！');
  }).finally((): void => {
    // $message.destroyAll();
  });

}


onMounted(async () => {

});

</script>

<style lang="less" scoped>

</style>


