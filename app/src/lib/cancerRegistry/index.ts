import { CancerRegistry } from "./CancerRegistry";
import { lungPlugin } from "./plugins/lungPlugin";
import { breastPlugin } from "./plugins/breastPlugin";
import { colonPlugin } from "./plugins/colonPlugin";
import { rectalPlugin } from "./plugins/rectalPlugin";
import { gastricPlugin } from "./plugins/gastricPlugin";
import { liverPlugin } from "./plugins/liverPlugin";
import { esophagealPlugin } from "./plugins/esophagealPlugin";
import { colorectalPlugin } from "./plugins/colorectalPlugin";
import { thyroidPlugin } from "./plugins/thyroidPlugin";
import { endometrialPlugin } from "./plugins/endometrialPlugin";
import { cervicalPlugin } from "./plugins/cervicalPlugin";
import { pancreaticPlugin } from "./plugins/pancreaticPlugin";

// 自动装载已有的标准化癌种插件
CancerRegistry.register(lungPlugin);
CancerRegistry.register(breastPlugin);
CancerRegistry.register(colonPlugin);
CancerRegistry.register(rectalPlugin);
CancerRegistry.register(gastricPlugin);
CancerRegistry.register(liverPlugin);
CancerRegistry.register(esophagealPlugin);
CancerRegistry.register(colorectalPlugin);
CancerRegistry.register(thyroidPlugin);
CancerRegistry.register(endometrialPlugin);
CancerRegistry.register(cervicalPlugin);
CancerRegistry.register(pancreaticPlugin);

export { CancerRegistry };
export * from "./types";
