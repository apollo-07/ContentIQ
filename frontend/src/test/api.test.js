import { describe, it, expect } from 'vitest';
import {
  getOverview,
  getContentTypes,
  getTopics,
  getTiming,
  getTrends,
  getInsights,
  getRecommendations,
  predictPerformance,
  simulateScenarios,
  getStrategy,
} from '../services/api';

describe('ContentIQ Centralized API Service & Schema Contract', () => {
  it('fetches overview with exact required fields', async () => {
    const data = await getOverview();
    expect(data).toHaveProperty('total_posts');
    expect(data).toHaveProperty('average_engagement_rate');
    expect(data).toHaveProperty('total_engagement');
    expect(data).toHaveProperty('best_content_type');
    expect(data).toHaveProperty('best_topic');
    expect(data).toHaveProperty('best_posting_time');
    expect(typeof data.total_posts).toBe('number');
    expect(typeof data.average_engagement_rate).toBe('number');
  });

  it('fetches content-types array with post counts and engagement rates', async () => {
    const data = await getContentTypes();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    const first = data.data[0];
    expect(first).toHaveProperty('content_type');
    expect(first).toHaveProperty('post_count');
    expect(first).toHaveProperty('average_engagement_rate');
    expect(first).toHaveProperty('median_engagement_rate');
  });

  it('fetches topics array with required fields', async () => {
    const data = await getTopics();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    const first = data.data[0];
    expect(first).toHaveProperty('topic');
    expect(first).toHaveProperty('post_count');
    expect(first).toHaveProperty('average_engagement_rate');
  });

  it('fetches timing with day_data and hour_data', async () => {
    const data = await getTiming();
    expect(data).toHaveProperty('day_data');
    expect(data).toHaveProperty('hour_data');
    expect(Array.isArray(data.day_data)).toBe(true);
    expect(Array.isArray(data.hour_data)).toBe(true);
    expect(data.day_data[0]).toHaveProperty('day');
    expect(data.day_data[0]).toHaveProperty('average_engagement_rate');
    expect(data.hour_data[0]).toHaveProperty('hour');
  });

  it('fetches insights with type, title, description, and impact', async () => {
    const data = await getInsights();
    expect(data).toHaveProperty('insights');
    expect(Array.isArray(data.insights)).toBe(true);
    const item = data.insights[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('impact');
  });

  it('fetches ranked recommendations with score and reasons', async () => {
    const data = await getRecommendations();
    expect(data).toHaveProperty('recommendations');
    expect(Array.isArray(data.recommendations)).toBe(true);
    const rec = data.recommendations[0];
    expect(rec).toHaveProperty('rank');
    expect(rec).toHaveProperty('content_type');
    expect(rec).toHaveProperty('topic');
    expect(rec).toHaveProperty('day');
    expect(rec).toHaveProperty('time_range');
    expect(rec).toHaveProperty('score');
    expect(rec).toHaveProperty('reasons');
    expect(Array.isArray(rec.reasons)).toBe(true);
  });

  it('runs post performance prediction and returns tier, probability, model, recommendations', async () => {
    const payload = {
      content_type: 'Reel',
      topic: 'Behind the Scenes',
      day: 'Saturday',
      posting_hour: 19,
      caption_length: 180,
      hashtag_count: 5,
      followers: 20000,
    };
    const res = await predictPerformance(payload);
    expect(res).toHaveProperty('prediction');
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(res.prediction);
    expect(res).toHaveProperty('probability');
    expect(typeof res.probability).toBe('number');
    expect(res).toHaveProperty('model');
    expect(res).toHaveProperty('recommendations');
    expect(Array.isArray(res.recommendations)).toBe(true);
  });

  it('runs scenario simulation and returns array of results', async () => {
    const payload = {
      scenarios: [
        { name: 'Scenario A', content_type: 'Reel', topic: 'Behind the Scenes', day: 'Saturday', posting_hour: 19 },
        { name: 'Scenario B', content_type: 'Single Image', topic: 'Product', day: 'Monday', posting_hour: 12 },
      ],
    };
    const res = await simulateScenarios(payload);
    expect(res).toHaveProperty('results');
    expect(Array.isArray(res.results)).toBe(true);
    expect(res.results.length).toBe(2);
    expect(res.results[0]).toHaveProperty('name');
    expect(res.results[0]).toHaveProperty('prediction');
    expect(res.results[0]).toHaveProperty('probability');
  });

  it('fetches weekly strategy plan with day, content_type, topic, time_range, and score', async () => {
    const data = await getStrategy();
    expect(data).toHaveProperty('strategy');
    expect(Array.isArray(data.strategy)).toBe(true);
    expect(data.strategy.length).toBeGreaterThan(0);
    const dayPlan = data.strategy[0];
    expect(dayPlan).toHaveProperty('day');
    expect(dayPlan).toHaveProperty('content_type');
    expect(dayPlan).toHaveProperty('topic');
    expect(dayPlan).toHaveProperty('time_range');
    expect(dayPlan).toHaveProperty('score');
  });
});
