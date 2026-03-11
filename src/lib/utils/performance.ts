// Utilidades de performance para evitar loops infinitos y optimizar carga

export class PerformanceMonitor {
  private static instances = new Map<string, PerformanceMonitor>();
  private loadCounts = new Map<string, number>();
  private lastLoadTimes = new Map<string, number>();
  
  private constructor(private componentName: string) {}
  
  static getInstance(componentName: string): PerformanceMonitor {
    if (!this.instances.has(componentName)) {
      this.instances.set(componentName, new PerformanceMonitor(componentName));
    }
    return this.instances.get(componentName)!;
  }
  
  canLoad(key: string = 'default', minInterval: number = 2000): boolean {
    const now = Date.now();
    const lastLoad = this.lastLoadTimes.get(key) || 0;
    const loadCount = this.loadCounts.get(key) || 0;
    
    // Evitar cargas muy frecuentes
    if (now - lastLoad < minInterval) {
      console.warn(`⚠️ ${this.componentName}: Carga muy frecuente para ${key}`);
      return false;
    }
    
    // Evitar demasiadas cargas en un período corto
    if (loadCount > 10) {
      console.error(`🚨 ${this.componentName}: Demasiadas cargas para ${key}, posible loop infinito`);
      return false;
    }
    
    return true;
  }
  
  recordLoad(key: string = 'default'): void {
    const now = Date.now();
    this.lastLoadTimes.set(key, now);
    
    const currentCount = this.loadCounts.get(key) || 0;
    this.loadCounts.set(key, currentCount + 1);
    
    // Resetear contador cada minuto
    setTimeout(() => {
      this.loadCounts.set(key, Math.max(0, (this.loadCounts.get(key) || 1) - 1));
    }, 60000);
  }
  
  reset(key?: string): void {
    if (key) {
      this.loadCounts.delete(key);
      this.lastLoadTimes.delete(key);
    } else {
      this.loadCounts.clear();
      this.lastLoadTimes.clear();
    }
  }
}

// Hook para usar el monitor de performance
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance(componentName);
  
  return {
    canLoad: (key?: string, minInterval?: number) => monitor.canLoad(key, minInterval),
    recordLoad: (key?: string) => monitor.recordLoad(key),
    reset: (key?: string) => monitor.reset(key)
  };
}

// Utilidad para debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utilidad para throttle
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 