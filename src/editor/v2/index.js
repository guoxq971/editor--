import {createGlobalState} from "@vueuse/core"
import {Editor} from "./editor"
import { reactive } from 'vue';

export const editor = createGlobalState(() => reactive(new Editor()))();
