// Sistema de Analytics Interno para GProA Technology
// Este script captura métricas de uso de la página sin depender de servicios externos
// Utiliza localStorage para almacenamiento persistente de datos

(function() {
  'use strict';

  // Configuración del sistema de analytics
  const ANALYTICS_KEY = 'gproa_analytics_data';
  const SESSION_KEY = 'gproa_session_id';

  // Estructura de datos inicial para métricas
  const defaultMetrics = {
    sessions: [],
    totalSessions: 0,
    totalClicks: 0,
    averageDuration: 0,
    sectionViews: {
      hero: 0,
      problema: 0,
      solucion: 0,
      fase1: 0,
      fase2: 0,
      valor: 0,
      roadmap: 0
    },
    clickCounts: {
      cta_contacto: 0,
      cta_descargar: 0,
      cta_demo: 0
    }
  };

  // Función para obtener datos de localStorage
  function getMetrics() {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      return data ? JSON.parse(data) : defaultMetrics;
    } catch (e) {
      console.warn('Error al cargar métricas:', e);
      return defaultMetrics;
    }
  }

  // Función para guardar datos en localStorage
  function saveMetrics(metrics) {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(metrics));
    } catch (e) {
      console.warn('Error al guardar métricas:', e);
    }
  }

  // Generar ID único para sesión
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Detectar si es una nueva sesión
  function isNewSession() {
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      const newId = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, newId);
      return true;
    }
    return false;
  }

  // Inicializar nueva sesión
  function initSession() {
    const metrics = getMetrics();
    const session = {
      id: sessionStorage.getItem(SESSION_KEY),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      sectionsViewed: [],
      scrollDepth: {
        hero: 0,
        problema: 0,
        solucion: 0,
        fase1: 0,
        fase2: 0,
        valor: 0,
        roadmap: 0
      },
      clicks: []
    };

    metrics.sessions.push(session);
    metrics.totalSessions++;
    saveMetrics(metrics);

    return session;
  }

  // Finalizar sesión
  function endSession() {
    const metrics = getMetrics();
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    const session = metrics.sessions.find(s => s.id === sessionId);

    if (session) {
      session.endTime = new Date().toISOString();
      session.duration = new Date(session.endTime) - new Date(session.startTime);

      // Actualizar duración promedio
      const totalDuration = metrics.sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      metrics.averageDuration = totalDuration / metrics.sessions.length;

      saveMetrics(metrics);
    }
  }

  // Tracking de secciones vistas con IntersectionObserver
  function initSectionTracking() {
    const sections = document.querySelectorAll('[data-section]');
    const metrics = getMetrics();
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    const session = metrics.sessions.find(s => s.id === sessionId);

    if (!session) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName && !session.sectionsViewed.includes(sectionName)) {
            session.sectionsViewed.push(sectionName);
            metrics.sectionViews[sectionName]++;
            saveMetrics(metrics);
          }
        }
      });
    }, { threshold: 0.5 }); // 50% visible

    sections.forEach(section => observer.observe(section));
  }

  // Tracking de scroll depth por sección
  function initScrollDepthTracking() {
    const sections = document.querySelectorAll('[data-section]');
    const metrics = getMetrics();
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    const session = metrics.sessions.find(s => s.id === sessionId);

    if (!session) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionName = entry.target.getAttribute('data-section');
        if (sectionName) {
          const ratio = Math.round(entry.intersectionRatio * 100);
          if (ratio > session.scrollDepth[sectionName]) {
            session.scrollDepth[sectionName] = ratio;
            saveMetrics(metrics);
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    });

    sections.forEach(section => observer.observe(section));
  }

  // Tracking de clics en elementos marcados
  function initClickTracking() {
    document.addEventListener('click', (e) => {
      const trackElement = e.target.closest('[data-track]');
      if (trackElement) {
        const trackType = trackElement.getAttribute('data-track');
        const metrics = getMetrics();
        const sessionId = sessionStorage.getItem(SESSION_KEY);
        const session = metrics.sessions.find(s => s.id === sessionId);

        if (session) {
          const clickEvent = {
            element: trackType,
            timestamp: new Date().toISOString()
          };
          session.clicks.push(clickEvent);
          metrics.clickCounts[trackType] = (metrics.clickCounts[trackType] || 0) + 1;
          metrics.totalClicks++;
          saveMetrics(metrics);
        }
      }
    });
  }

  // API pública para acceder a métricas (útil para dashboard)
  window.GProAAnalytics = {
    getMetrics: getMetrics,
    resetMetrics: function() {
      saveMetrics(defaultMetrics);
      sessionStorage.removeItem(SESSION_KEY);
      console.log('Métricas reseteadas');
    },
    exportMetrics: function() {
      const metrics = getMetrics();
      const dataStr = JSON.stringify(metrics, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'gproa_analytics_export.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  // Inicialización del sistema
  document.addEventListener('DOMContentLoaded', () => {
    if (isNewSession()) {
      initSession();
    }
    initSectionTracking();
    initScrollDepthTracking();
    initClickTracking();
  });

  // Finalizar sesión al cerrar la página
  window.addEventListener('beforeunload', endSession);

  // Log para debugging
  console.log('GProA Analytics inicializado');

})();