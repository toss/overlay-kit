import DefaultTheme from 'vitepress/theme';
import { Sandbox } from 'vitepress-plugin-sandpack';
import 'vitepress-plugin-sandpack/dist/style.css';
import OverlayKitSandbox from './overlay-kit-sandbox.vue';
import './index.css';

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('Sandbox', Sandbox);
    ctx.app.component('OverlayKitSandbox', OverlayKitSandbox);
  },
};
