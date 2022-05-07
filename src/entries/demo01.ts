import { createApp } from 'vue';
import HelloWorld from '../pages/HelloWorld.vue';

createApp(HelloWorld).mount('#app');

export const HelloWorldComp = HelloWorld;
export const add = (a: number, b: number) => a + b;
