import type { CancerType } from "@/lib/types";
import type { CancerPluginSpec, CancerTypeOption } from "./types";

/**
 * 癌种插件注册中心 (Cancer Registry Manager)
 * 采用注册表模式 (Registry Pattern)，彻底解耦各癌种专属业务逻辑与全局主干框架
 */
class CancerRegistryManager {
  private plugins = new Map<CancerType, CancerPluginSpec>();
  private defaultType: CancerType = "lung";

  /**
   * 注册一个癌种插件
   */
  public register(spec: CancerPluginSpec): void {
    this.plugins.set(spec.id, spec);
  }

  /**
   * 获取指定癌种插件，若未找到则安全回退至默认癌种 (lung)
   */
  public get(type?: CancerType | string | null): CancerPluginSpec {
    if (type && this.plugins.has(type as CancerType)) {
      return this.plugins.get(type as CancerType)!;
    }
    const defaultPlugin = this.plugins.get(this.defaultType);
    if (!defaultPlugin) {
      throw new Error(`CancerRegistry: Default cancer plugin '${this.defaultType}' not registered yet.`);
    }
    return defaultPlugin;
  }

  /**
   * 检查指定癌种是否已注册
   */
  public has(type?: string | null): boolean {
    if (!type) return false;
    return this.plugins.has(type as CancerType);
  }

  /**
   * 获取所有已注册的癌种插件列表
   */
  public getAll(): CancerPluginSpec[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取所有支持的癌种标识列表
   */
  public getSupportedTypes(): CancerType[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * 动态生成供前端 CancerSwitch 组件使用的配置项列表
   */
  public getOptions(): CancerTypeOption[] {
    return this.getAll().map((p) => ({
      type: p.id,
      label: p.name,
      icon: p.icon,
      activeColor: p.theme.badgeColor,
      title: `切换至${p.name}循证系统`,
      enName: p.enName,
      organ: p.organ,
    }));
  }
}

export const CancerRegistry = new CancerRegistryManager();
