const { calculateDistance } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Algoritmo de otimização de rotas usando Nearest Neighbor (Vizinho Mais Próximo)
 * Para rotas mais complexas, considere usar APIs como Google Maps Directions API
 * ou algoritmos mais avançados como Ant Colony Optimization
 */

// Otimizar rota usando algoritmo do vizinho mais próximo
const optimizeRouteNearestNeighbor = (points, startLocation = null) => {
  try {
    if (!points || points.length === 0) {
      return [];
    }

    if (points.length === 1) {
      return points;
    }

    const unvisited = [...points];
    const optimized = [];
    
    // Ponto inicial (pode ser a localização atual do coletor ou o primeiro ponto)
    let current = startLocation 
      ? findNearestPoint(startLocation, unvisited)
      : unvisited[0];
    
    // Remover ponto inicial dos não visitados
    const currentIndex = unvisited.findIndex(p => p._id.toString() === current._id.toString());
    if (currentIndex !== -1) {
      unvisited.splice(currentIndex, 1);
    }
    optimized.push(current);

    // Enquanto houver pontos não visitados
    while (unvisited.length > 0) {
      const nearest = findNearestPoint(current.address.location, unvisited);
      
      const nearestIndex = unvisited.findIndex(p => p._id.toString() === nearest._id.toString());
      if (nearestIndex !== -1) {
        unvisited.splice(nearestIndex, 1);
      }
      
      optimized.push(nearest);
      current = nearest;
    }

    logger.info(`Rota otimizada: ${points.length} pontos ordenados`);
    return optimized;
  } catch (error) {
    logger.error(`Erro ao otimizar rota: ${error.message}`);
    return points; // Retornar ordem original em caso de erro
  }
};

// Encontrar ponto mais próximo
const findNearestPoint = (location, points) => {
  let nearest = points[0];
  let minDistance = Infinity;

  for (const point of points) {
    const distance = calculateDistance(
      location.coordinates || location,
      point.address.location.coordinates
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  }

  return nearest;
};

// Calcular distância total da rota
const calculateTotalDistance = (points) => {
  if (!points || points.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const distance = calculateDistance(
      points[i].address.location.coordinates,
      points[i + 1].address.location.coordinates
    );
    totalDistance += distance;
  }

  return totalDistance;
};

// Calcular tempo estimado da rota
const calculateEstimatedTime = (distance, averageSpeed = 30) => {
  // distance em km, averageSpeed em km/h
  // Adicionar tempo médio de parada por ponto (5 minutos)
  const travelTime = (distance / averageSpeed) * 60; // em minutos
  const stopTime = 5; // minutos por ponto
  
  return {
    travelTime: Math.round(travelTime),
    stopTime,
    totalTime: Math.round(travelTime + stopTime),
  };
};

// Agrupar pontos por proximidade (clustering)
const clusterPoints = (points, maxPointsPerCluster = 10) => {
  try {
    if (points.length <= maxPointsPerCluster) {
      return [points];
    }

    const clusters = [];
    const unassigned = [...points];

    while (unassigned.length > 0) {
      const cluster = [];
      const seed = unassigned.shift();
      cluster.push(seed);

      // Adicionar pontos próximos ao cluster
      while (cluster.length < maxPointsPerCluster && unassigned.length > 0) {
        const nearest = findNearestPoint(
          seed.address.location,
          unassigned
        );
        
        const index = unassigned.findIndex(p => p._id.toString() === nearest._id.toString());
        if (index !== -1) {
          cluster.push(unassigned.splice(index, 1)[0]);
        } else {
          break;
        }
      }

      clusters.push(cluster);
    }

    logger.info(`Pontos agrupados em ${clusters.length} clusters`);
    return clusters;
  } catch (error) {
    logger.error(`Erro ao agrupar pontos: ${error.message}`);
    return [points];
  }
};

// Otimizar múltiplas rotas (para múltiplos coletores)
const optimizeMultipleRoutes = (points, numberOfRoutes) => {
  try {
    // Agrupar pontos em clusters
    const clusters = clusterPoints(points, Math.ceil(points.length / numberOfRoutes));
    
    // Otimizar cada cluster
    const optimizedRoutes = clusters.map((cluster, index) => {
      const optimized = optimizeRouteNearestNeighbor(cluster);
      const distance = calculateTotalDistance(optimized);
      const time = calculateEstimatedTime(distance, 30);

      return {
        routeNumber: index + 1,
        points: optimized,
        totalDistance: distance,
        estimatedTime: time,
        pointsCount: optimized.length,
      };
    });

    logger.info(`${numberOfRoutes} rotas otimizadas`);
    return optimizedRoutes;
  } catch (error) {
    logger.error(`Erro ao otimizar múltiplas rotas: ${error.message}`);
    return [];
  }
};

// Balancear rotas (distribuir pontos igualmente)
const balanceRoutes = (points, numberOfRoutes) => {
  try {
    const pointsPerRoute = Math.ceil(points.length / numberOfRoutes);
    const routes = [];

    // Ordenar pontos por localização (latitude)
    const sorted = [...points].sort((a, b) => 
      a.address.location.coordinates[1] - b.address.location.coordinates[1]
    );

    for (let i = 0; i < numberOfRoutes; i++) {
      const start = i * pointsPerRoute;
      const end = Math.min(start + pointsPerRoute, sorted.length);
      const routePoints = sorted.slice(start, end);

      if (routePoints.length > 0) {
        const optimized = optimizeRouteNearestNeighbor(routePoints);
        const distance = calculateTotalDistance(optimized);
        const time = calculateEstimatedTime(distance, 30);

        routes.push({
          routeNumber: i + 1,
          points: optimized,
          totalDistance: distance,
          estimatedTime: time,
          pointsCount: optimized.length,
        });
      }
    }

    logger.info(`Rotas balanceadas: ${routes.length} rotas criadas`);
    return routes;
  } catch (error) {
    logger.error(`Erro ao balancear rotas: ${error.message}`);
    return [];
  }
};

// Calcular melhor rota entre dois pontos
const calculateBestRoute = (start, end, waypoints = []) => {
  try {
    const allPoints = [start, ...waypoints, end];
    const optimized = optimizeRouteNearestNeighbor(allPoints.slice(1), start);
    const distance = calculateTotalDistance([start, ...optimized]);
    const time = calculateEstimatedTime(distance, 30);

    return {
      points: optimized,
      totalDistance: distance,
      estimatedTime: time,
      waypoints: optimized.length - 1,
    };
  } catch (error) {
    logger.error(`Erro ao calcular melhor rota: ${error.message}`);
    return null;
  }
};

// Verificar se ponto está na rota
const isPointOnRoute = (point, route, tolerance = 0.5) => {
  // tolerance em km
  for (const routePoint of route.points) {
    const distance = calculateDistance(
      point.address.location.coordinates,
      routePoint.address.location.coordinates
    );

    if (distance <= tolerance) {
      return true;
    }
  }

  return false;
};

// Adicionar ponto à rota existente (na melhor posição)
const addPointToRoute = (point, route) => {
  try {
    if (!route.points || route.points.length === 0) {
      return {
        points: [point],
        totalDistance: 0,
        estimatedTime: calculateEstimatedTime(0, 30),
      };
    }

    let bestPosition = 0;
    let minIncrease = Infinity;

    // Testar cada posição possível
    for (let i = 0; i <= route.points.length; i++) {
      const testRoute = [...route.points];
      testRoute.splice(i, 0, point);
      
      const distance = calculateTotalDistance(testRoute);
      const increase = distance - (route.totalDistance || 0);

      if (increase < minIncrease) {
        minIncrease = increase;
        bestPosition = i;
      }
    }

    // Inserir na melhor posição
    const updatedPoints = [...route.points];
    updatedPoints.splice(bestPosition, 0, point);

    const totalDistance = calculateTotalDistance(updatedPoints);
    const estimatedTime = calculateEstimatedTime(totalDistance, 30);

    logger.info(`Ponto adicionado à rota na posição ${bestPosition}`);

    return {
      points: updatedPoints,
      totalDistance,
      estimatedTime,
      insertPosition: bestPosition,
    };
  } catch (error) {
    logger.error(`Erro ao adicionar ponto à rota: ${error.message}`);
    return route;
  }
};

// Remover ponto da rota
const removePointFromRoute = (pointId, route) => {
  try {
    const updatedPoints = route.points.filter(
      p => p._id.toString() !== pointId.toString()
    );

    const totalDistance = calculateTotalDistance(updatedPoints);
    const estimatedTime = calculateEstimatedTime(totalDistance, 30);

    logger.info(`Ponto removido da rota`);

    return {
      points: updatedPoints,
      totalDistance,
      estimatedTime,
    };
  } catch (error) {
    logger.error(`Erro ao remover ponto da rota: ${error.message}`);
    return route;
  }
};

// Obter estatísticas da rota
const getRouteStatistics = (route) => {
  try {
    const totalDistance = calculateTotalDistance(route.points);
    const estimatedTime = calculateEstimatedTime(totalDistance, 30);
    
    // Calcular peso total
    const totalWeight = route.points.reduce(
      (sum, point) => sum + (point.estimatedWeight || 0),
      0
    );

    // Agrupar por tipo de resíduo
    const wasteTypes = {};
    route.points.forEach(point => {
      const type = point.wasteType || 'outros';
      wasteTypes[type] = (wasteTypes[type] || 0) + 1;
    });

    // Agrupar por bairro
    const neighborhoods = {};
    route.points.forEach(point => {
      const neighborhood = point.address.neighborhood || 'Não especificado';
      neighborhoods[neighborhood] = (neighborhoods[neighborhood] || 0) + 1;
    });

    return {
      totalPoints: route.points.length,
      totalDistance,
      estimatedTime,
      totalWeight,
      wasteTypes,
      neighborhoods,
      averageWeightPerPoint: totalWeight / route.points.length,
      averageDistanceBetweenPoints: totalDistance / (route.points.length - 1 || 1),
    };
  } catch (error) {
    logger.error(`Erro ao calcular estatísticas da rota: ${error.message}`);
    return null;
  }
};

module.exports = {
  optimizeRouteNearestNeighbor,
  findNearestPoint,
  calculateTotalDistance,
  calculateEstimatedTime,
  clusterPoints,
  optimizeMultipleRoutes,
  balanceRoutes,
  calculateBestRoute,
  isPointOnRoute,
  addPointToRoute,
  removePointFromRoute,
  getRouteStatistics,
};
