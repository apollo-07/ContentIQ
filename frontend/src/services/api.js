import axios from 'axios';
import {
  mockOverview,
  mockContentTypes,
  mockTopics,
  mockTiming,
  mockTrends,
  mockInsights,
  mockRecommendations,
  mockPrediction,
  mockSimulation,
  mockStrategy,
  mockDatasets,
  mockUser,
} from '../mock/mockData';

// Environment & Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Check if Mock Mode is active (can be overridden via localStorage for testing)
export const isMockMode = () => {
  const localOverride = localStorage.getItem('contentiq_use_mock');
  if (localOverride !== null) {
    return localOverride === 'true';
  }
  return import.meta.env.VITE_USE_MOCK !== 'false';
};

export const setMockMode = (enabled) => {
  localStorage.setItem('contentiq_use_mock', enabled ? 'true' : 'false');
};

// Create Axios Client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('contentiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for simulated mock delay
const mockDelay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// AUTHENTICATION SERVICES
// ==========================================

export async function registerUser({ email, password, name }) {
  if (isMockMode()) {
    await mockDelay(400);
    const mockAuthResponse = {
      access_token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      token_type: 'bearer',
      user: {
        id: 'usr_' + Date.now(),
        email,
        name: name || email.split('@')[0],
        role: 'Creator',
        created_at: new Date().toISOString(),
      },
    };
    return mockAuthResponse;
  }
  const response = await apiClient.post('/auth/register', { email, password, name });
  return response.data;
}

export async function loginUser({ email, password }) {
  if (isMockMode()) {
    await mockDelay(350);
    const mockAuthResponse = {
      access_token: 'mock_jwt_token_auth_' + Date.now(),
      token_type: 'bearer',
      user: {
        ...mockUser,
        email: email || mockUser.email,
      },
    };
    return mockAuthResponse;
  }
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

// ==========================================
// DATASET SERVICES
// ==========================================

export async function uploadDataset(formDataOrFile) {
  if (isMockMode()) {
    await mockDelay(600);
    const filename = formDataOrFile?.name || (formDataOrFile?.get && formDataOrFile.get('file')?.name) || 'uploaded_dataset.csv';
    const newDataset = {
      id: 'ds_' + Date.now().toString(36),
      filename,
      created_at: new Date().toISOString(),
      total_rows: 500,
      total_columns: 10,
      missing_values: 2,
      duplicates: 0,
      status: 'PROCESSED',
      file_size_bytes: 65400,
      message: 'Dataset uploaded and validated successfully.',
    };
    // Save to session mock store
    const existing = JSON.parse(localStorage.getItem('contentiq_custom_datasets') || '[]');
    localStorage.setItem('contentiq_custom_datasets', JSON.stringify([newDataset, ...existing]));
    return newDataset;
  }

  let body = formDataOrFile;
  if (formDataOrFile instanceof File) {
    body = new FormData();
    body.append('file', formDataOrFile);
  }

  const response = await apiClient.post('/datasets/upload', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getDatasets() {
  if (isMockMode()) {
    await mockDelay(250);
    const custom = JSON.parse(localStorage.getItem('contentiq_custom_datasets') || '[]');
    return [...custom, ...mockDatasets];
  }
  const response = await apiClient.get('/datasets');
  return response.data;
}

export async function getDatasetById(dataset_id) {
  if (isMockMode()) {
    await mockDelay(200);
    const custom = JSON.parse(localStorage.getItem('contentiq_custom_datasets') || '[]');
    const all = [...custom, ...mockDatasets];
    const found = all.find((d) => d.id === dataset_id) || all[0];
    return found;
  }
  const response = await apiClient.get(`/datasets/${dataset_id}`);
  return response.data;
}

// ==========================================
// ANALYTICS SERVICES
// ==========================================

export async function getOverview() {
  if (isMockMode()) {
    await mockDelay(300);
    return { ...mockOverview };
  }
  const response = await apiClient.get('/analytics/overview');
  return response.data;
}

export async function getContentTypes() {
  if (isMockMode()) {
    await mockDelay(280);
    return { ...mockContentTypes };
  }
  const response = await apiClient.get('/analytics/content-types');
  return response.data;
}

export async function getTopics() {
  if (isMockMode()) {
    await mockDelay(280);
    return { ...mockTopics };
  }
  const response = await apiClient.get('/analytics/topics');
  return response.data;
}

export async function getTiming() {
  if (isMockMode()) {
    await mockDelay(300);
    return { ...mockTiming };
  }
  const response = await apiClient.get('/analytics/timing');
  return response.data;
}

export async function getTrends() {
  if (isMockMode()) {
    await mockDelay(320);
    return { ...mockTrends };
  }
  const response = await apiClient.get('/analytics/trends');
  return response.data;
}

// ==========================================
// INSIGHTS & RECOMMENDATIONS
// ==========================================

export async function getInsights() {
  if (isMockMode()) {
    await mockDelay(280);
    return { ...mockInsights };
  }
  const response = await apiClient.get('/insights');
  return response.data;
}

export async function getRecommendations() {
  if (isMockMode()) {
    await mockDelay(300);
    return { ...mockRecommendations };
  }
  const response = await apiClient.get('/recommendations');
  return response.data;
}

// ==========================================
// PREDICTION & SIMULATION
// ==========================================

export async function predictPerformance(postData) {
  if (isMockMode()) {
    await mockDelay(450);

    // Compute dynamic mock estimation based on inputs for a realistic interactive experience
    const { content_type, topic, posting_hour, caption_length, hashtag_count } = postData || {};
    let score = 50;

    if (content_type === 'Reel') score += 20;
    else if (content_type === 'Carousel') score += 12;
    else if (content_type === 'Single Image') score += 2;

    if (topic === 'Behind the Scenes') score += 15;
    else if (topic === 'Tutorial & Tips' || topic === 'Tutorial') score += 10;
    else if (topic === 'Product') score += 8;

    const hour = Number(posting_hour);
    if (hour >= 18 && hour <= 21) score += 12;
    else if (hour >= 11 && hour <= 14) score += 5;

    const hashtags = Number(hashtag_count || 0);
    if (hashtags >= 3 && hashtags <= 7) score += 6;
    else if (hashtags > 15) score -= 8;

    const caption = Number(caption_length || 0);
    if (caption >= 120 && caption <= 400) score += 5;

    const probability = Math.min(0.96, Math.max(0.22, Number((score / 100).toFixed(2))));
    let prediction = 'MEDIUM';
    if (probability >= 0.72) prediction = 'HIGH';
    else if (probability < 0.45) prediction = 'LOW';

    const customRecs = [
      hour < 18 || hour > 21
        ? 'Consider shifting posting time to peak window between 19:00 and 21:00 for +18% initial reach.'
        : 'Posting time is well-optimized within prime traffic window.',
      content_type !== 'Reel'
        ? 'Test adapting this format into a short-form Reel to increase viral discovery.'
        : 'Reel format is optimal for maximum algorithmic distribution.',
      hashtags > 8
        ? 'Reduce hashtag density to 3-5 hyper-relevant tags to avoid reach penalties.'
        : 'Hashtag quantity is aligned with optimal engagement parameters.',
    ];

    return {
      prediction,
      probability,
      model: 'RandomForest',
      recommendations: customRecs,
    };
  }

  const response = await apiClient.post('/predict', postData);
  return response.data;
}

export async function simulateScenarios(scenariosPayload) {
  if (isMockMode()) {
    await mockDelay(500);
    const scenarios = Array.isArray(scenariosPayload)
      ? scenariosPayload
      : scenariosPayload?.scenarios || [];

    if (scenarios.length === 0) {
      return { ...mockSimulation };
    }

    const results = scenarios.map((s, idx) => {
      let score = 50;
      if (s.content_type === 'Reel') score += 22;
      else if (s.content_type === 'Carousel') score += 14;
      else if (s.content_type === 'Single Image') score += 2;

      if (s.topic === 'Behind the Scenes') score += 16;
      else if (s.topic === 'Tutorial' || s.topic === 'Tutorial & Tips') score += 12;

      const hour = Number(s.posting_hour || 12);
      if (hour >= 18 && hour <= 21) score += 12;

      const prob = Math.min(0.95, Math.max(0.25, Number((score / 100).toFixed(2))));
      const pred = prob >= 0.7 ? 'HIGH' : prob >= 0.45 ? 'MEDIUM' : 'LOW';

      return {
        name: s.name || `Scenario ${String.fromCharCode(65 + idx)}`,
        prediction: pred,
        probability: prob,
        model: 'RandomForest',
        expected_engagement_rate: Number((prob * 10.5).toFixed(1)),
      };
    });

    return { results };
  }

  const response = await apiClient.post('/simulate', scenariosPayload);
  return response.data;
}

// ==========================================
// STRATEGY SERVICES
// ==========================================

export async function getStrategy() {
  if (isMockMode()) {
    await mockDelay(300);
    return { ...mockStrategy };
  }
  const response = await apiClient.get('/strategy');
  return response.data;
}

// Health check function to test backend connection
export async function checkBackendHealth() {
  try {
    const startTime = performance.now();
    const res = await apiClient.get('/', { timeout: 3000 });
    const latency = Math.round(performance.now() - startTime);
    return { online: true, latency, data: res.data };
  } catch (err) {
    return { online: false, latency: null, error: err.message };
  }
}
