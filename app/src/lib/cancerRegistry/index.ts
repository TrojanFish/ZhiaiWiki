import { CancerRegistry } from "./CancerRegistry";
import { lungPlugin } from "./plugins/lungPlugin";
import { breastPlugin } from "./plugins/breastPlugin";

// 自动装载肺癌与乳腺癌标准化插件
CancerRegistry.register(lungPlugin);
CancerRegistry.register(breastPlugin);

export { CancerRegistry };
export * from "./types";
