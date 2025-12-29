// Inicializar gráficas y efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Configurar header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Gráfico de evolución de capacidades
  const evolutionOptions = {
    series: [{
      name: 'Capacidad de Análisis',
      data: [20, 60, 85, 100]
    }],
    chart: {
      type: 'area',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#00c9ff'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Captura de Datos', 'Business Intelligence', 'Alertas Inteligentes', 'Inteligencia Artificial'],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Capacidad (%)',
        style: {
          color: '#64748b',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600
        }
      },
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + "% de capacidad"
        }
      },
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    }
  };

  const evolutionChart = new ApexCharts(document.querySelector("#evolutionChart"), evolutionOptions);
  evolutionChart.render();

  // Efecto de scroll para elementos con clase fade-in
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  // Animación para las estadísticas del hero
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const finalValue = stat.textContent;
    let currentValue = 0;
    const isPercentage = finalValue.includes('%');
    const isDays = finalValue.includes('días') || finalValue.includes('dias');
    const isROI = finalValue.includes(':');
    
    let numericValue;
    if (isPercentage) {
      numericValue = parseInt(finalValue);
    } else if (isDays) {
      numericValue = 0;
    } else if (isROI) {
      const parts = finalValue.split(':');
      numericValue = parseFloat(parts[0]);
    } else {
      numericValue = parseInt(finalValue);
    }
    
    const increment = numericValue / 30;
    const timer = setInterval(() => {
      if (isDays) {
        if (currentValue < 3) {
          currentValue += 0.1;
          stat.textContent = currentValue.toFixed(1) + ' días';
        } else {
          stat.textContent = finalValue;
          clearInterval(timer);
        }
      } else {
        currentValue += increment;
        if (currentValue >= numericValue) {
          stat.textContent = finalValue;
          clearInterval(timer);
        } else {
          if (isPercentage) {
            stat.textContent = Math.floor(currentValue) + '%';
          } else if (isROI) {
            stat.textContent = currentValue.toFixed(1) + ':1';
          } else {
            stat.textContent = Math.floor(currentValue) + '%';
          }
        }
      }
    }, 40);
  });

  // Manejo de clics en botones CTA
  document.querySelectorAll('[data-cta]').forEach(button => {
    button.addEventListener('click', function(e) {
      const ctaType = this.getAttribute('data-cta');
      
      // Simulación de acciones según el tipo de CTA
      if (ctaType === 'download-proposal') {
        e.preventDefault();
        alert('¡Gracias por su interés! La propuesta completa en formato PDF se ha enviado a su correo electrónico.');
        
        // Aquí iría el código para descargar el PDF o enviar por email
        // window.open('propuesta-gproa-tendencias-web-dci.pdf', '_blank');
      }
      
      if (ctaType === 'proposal-1' || ctaType === 'proposal-2') {
        e.preventDefault();
        const propName = ctaType === 'proposal-1' ? 'Plataforma de Monitoreo + BI' : 'Inteligencia Predictiva + IA';
        alert(`¡Excelente elección! Un consultor especializado en ${propName} se pondrá en contacto con usted para personalizar la propuesta.`);
      }
      
      if (ctaType === 'contact' || ctaType === 'demo') {
        e.preventDefault();
        alert('Perfecto, lo pondremos en contacto con uno de nuestros consultores especializados en las próximas 24 horas.');
      }
      
      // Aquí iría el código real para enviar el evento a tu sistema de analytics
      // gtag('event', 'click', { 'event_category': 'CTA', 'event_label': ctaType });
    });
  });

  // Cargar KPIs desde metrics.json
  fetch('public/data/metrics.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('kpiContainer');
      container.innerHTML = `
        <div class="metric-card fade-in">
          <div class="metric-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="metric-value">${data.totalRevenue.toLocaleString()}</div>
          <div class="metric-label">Ingresos Totales</div>
        </div>
        
        <div class="metric-card fade-in">
          <div class="metric-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="metric-value">${data.totalOrders}</div>
          <div class="metric-label">Total de Órdenes</div>
        </div>
        
        <div class="metric-card fade-in">
          <div class="metric-icon">
            <i class="fas fa-calculator"></i>
          </div>
          <div class="metric-value">${data.averageOrderValue.toFixed(2)}</div>
          <div class="metric-label">Valor Promedio de Orden</div>
        </div>
      `;
    })
    .catch(error => console.error('Error cargando KPIs:', error));

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});