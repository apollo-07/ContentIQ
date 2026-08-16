import { describe, it, expect } from 'vitest';
import { parseAndValidateCSV } from '../services/csvParser';

describe('CSV Parser and Validator Utility', () => {
  it('correctly parses rows, columns, and computes missing/duplicate stats', async () => {
    const csvContent =
      'post_id,content_type,topic,engagement_rate\n' +
      '1,Reel,Behind the Scenes,8.6\n' +
      '2,Carousel,Tutorial,7.8\n' +
      '3,Single Image,Product,\n' + // missing engagement_rate
      '1,Reel,Behind the Scenes,8.6\n'; // duplicate row

    const file = new File([csvContent], 'test_posts.csv', { type: 'text/csv' });
    const result = await parseAndValidateCSV(file);

    expect(result.isValid).toBe(true);
    expect(result.rowCount).toBe(4);
    expect(result.columnCount).toBe(4);
    expect(result.missingValues).toBe(1);
    expect(result.duplicates).toBe(1);
    expect(result.headers).toEqual(['post_id', 'content_type', 'topic', 'engagement_rate']);
  });

  it('handles empty files gracefully', async () => {
    const file = new File([''], 'empty.csv', { type: 'text/csv' });
    const result = await parseAndValidateCSV(file);
    expect(result.isValid).toBe(false);
    expect(result.rowCount).toBe(0);
  });
});
