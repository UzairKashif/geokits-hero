'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run performance monitoring in production and on mobile
    if (process.env.NODE_ENV !== 'production') return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;

    const metrics: PerformanceMetrics = {};

    // Measure Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
              console.log(`FCP: ${entry.startTime.toFixed(2)}ms`);
            }
            break;
          
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
            break;
          
          case 'first-input':
            metrics.fid = (entry as FirstInputEntry).processingStart - entry.startTime;
            console.log(`FID: ${metrics.fid?.toFixed(2)}ms`);
            break;
          
          case 'layout-shift':
            if (!(entry as LayoutShiftEntry).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as LayoutShiftEntry).value;
              console.log(`CLS: ${metrics.cls?.toFixed(3)}`);
            }
            break;
        }
      });
    });

    // Observe performance entries
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Measure TTFB
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
    }

    // Report to analytics after 5 seconds
    const reportTimer = setTimeout(() => {
      // Here you can send metrics to your analytics service
      console.log('Performance Metrics:', metrics);
      
      // Check for performance issues and warn
      if (metrics.lcp && metrics.lcp > 4000) {
        console.warn('Poor LCP performance detected on mobile');
      }
      if (metrics.fid && metrics.fid > 300) {
        console.warn('Poor FID performance detected on mobile');
      }
      if (metrics.cls && metrics.cls > 0.25) {
        console.warn('Poor CLS performance detected on mobile');
      }
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(reportTimer);
    };
  }, []);

  return null; // This component doesn't render anything
}

export default PerformanceMonitor;
