import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { App, defineComponent } from "vue";
import faIcon from "./src/FaIcon.vue";
import { iconComponents } from "/@/plugins/element-plus";

export const Icon = Object.assign(faIcon, {
  install(app: App) {
    app.component(faIcon.name, faIcon);
  }
});

export default {
  Icon
};
export function findIconRegx(icon: string) {
  const faReg = /^fa-/;
  if (faReg.test(icon)) {
    return findIcon(icon.split(faReg)[1]);
  } else {
    return findIcon(icon, false);
  }
}
export function findIcon(icon: String, isFa: Boolean = true) {
  if (isFa) {
    return defineComponent({
      name: "FaIcon",
      data() {
        return { icon: icon };
      },
      components: { FontAwesomeIcon },
      template: `<font-awesome-icon :icon="icon" />`
    });
  } else {
    const array = iconComponents.filter(c => {
      return c.name == icon;
    });
    return array[0] || null;
  }
}
