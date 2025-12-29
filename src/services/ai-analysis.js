// Sistema de Análisis IA para eCommerce
// Utiliza TensorFlow.js para predicciones y análisis de datos

import * as tf from '@tensorflow/tfjs';

class AIAnalysis {
  constructor() {
    this.models = {};
    this.data = null;
  }

  // Cargar datos de eCommerce
  async loadData() {
    try {
      const response = await fetch('public/data/ecommerce-data.json');
      this.data = await response.json();
      console.log('Datos de eCommerce cargados:', this.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }

  // Predicción de ventas usando regresión lineal simple
  async predictSales(productId, daysAhead = 7) {
    if (!this.data) await this.loadData();

    const product = this.data.products.find(p => p.id === productId);
    if (!product) return null;

    const sales = product.sales.map((s, i) => ({ x: i, y: s.quantity }));

    // Preparar datos para TensorFlow
    const xs = tf.tensor2d(sales.map(s => [s.x]));
    const ys = tf.tensor1d(sales.map(s => s.y));

    // Crear modelo de regresión lineal
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 1 }));

    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    // Entrenar modelo
    await model.fit(xs, ys, { epochs: 100, verbose: 0 });

    // Hacer predicciones
    const predictions = [];
    for (let i = 0; i < daysAhead; i++) {
      const prediction = model.predict(tf.tensor2d([[sales.length + i]]));
      predictions.push(prediction.dataSync()[0]);
    }

    // Limpiar memoria
    xs.dispose();
    ys.dispose();
    model.dispose();

    return predictions;
  }

  // Análisis de clustering simple para segmentación de productos
  async clusterProducts() {
    if (!this.data) await this.loadData();

    const products = this.data.products.map(p => ({
      price: p.price,
      totalSales: p.sales.reduce((sum, s) => sum + s.quantity, 0),
      avgDailySales: p.sales.reduce((sum, s) => sum + s.quantity, 0) / p.sales.length
    }));

    // Normalizar datos
    const prices = products.map(p => p.price);
    const sales = products.map(p => p.totalSales);
    const avgSales = products.map(p => p.avgDailySales);

    const normalize = (arr) => {
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return arr.map(x => (x - min) / (max - min));
    };

    const normalizedData = tf.tensor2d([
      normalize(prices),
      normalize(sales),
      normalize(avgSales)
    ]).transpose();

    // K-means simple (implementación básica)
    const k = 2; // Número de clusters
    const centroids = tf.randomUniform([k, 3]);

    for (let iter = 0; iter < 10; iter++) {
      // Calcular distancias
      const distances = tf.sum(tf.square(tf.sub(
        tf.expandDims(normalizedData, 1),
        tf.expandDims(centroids, 0)
      )), 2);

      // Asignar clusters
      const clusters = tf.argMin(distances, 1);

      // Actualizar centroides
      for (let i = 0; i < k; i++) {
        const mask = tf.equal(clusters, i);
        const clusterPoints = tf.booleanMask(normalizedData, mask);
        if (clusterPoints.shape[0] > 0) {
          centroids[i] = tf.mean(clusterPoints, 0);
        }
      }
    }

    const clusterAssignments = tf.argMin(tf.sum(tf.square(tf.sub(
      tf.expandDims(normalizedData, 1),
      tf.expandDims(centroids, 0)
    )), 2), 1).dataSync();

    // Limpiar memoria
    normalizedData.dispose();
    centroids.dispose();

    return this.data.products.map((p, i) => ({
      ...p,
      cluster: clusterAssignments[i]
    }));
  }

  // Scoring de productos basado en rendimiento
  scoreProducts() {
    if (!this.data) return [];

    return this.data.products.map(product => {
      const totalSales = product.sales.reduce((sum, s) => sum + s.quantity, 0);
      const totalRevenue = product.sales.reduce((sum, s) => sum + s.revenue, 0);
      const avgDailySales = totalSales / product.sales.length;
      const trend = this.calculateTrend(product.sales.map(s => s.quantity));

      // Score basado en ventas, ingresos y tendencia
      const score = (totalSales * 0.4) + (totalRevenue / 1000 * 0.4) + (trend * 0.2);

      return {
        ...product,
        score: Math.round(score * 100) / 100,
        risk: score < 50 ? 'Alto' : score < 100 ? 'Medio' : 'Bajo',
        opportunity: trend > 0 ? 'Alta' : 'Baja'
      };
    });
  }

  // Calcular tendencia simple
  calculateTrend(sales) {
    if (sales.length < 2) return 0;

    const n = sales.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = sales.reduce((a, b) => a + b, 0);
    const sumXY = sales.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  // Análisis predictivo de demanda
  async predictDemand(productId) {
    const predictions = await this.predictSales(productId, 30);
    if (!predictions) return null;

    const avgPrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;
    const currentStock = this.data.products.find(p => p.id === productId).stock;

    return {
      predictedDemand: Math.round(avgPrediction),
      currentStock,
      daysUntilStockout: currentStock / avgPrediction,
      recommendation: avgPrediction > currentStock / 30 ? 'Aumentar stock' : 'Stock suficiente'
    };
  }
}

// Instancia global
window.AIAnalysis = new AIAnalysis();