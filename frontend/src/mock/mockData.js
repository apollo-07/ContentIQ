// ContentIQ Mock Data strictly matching Developer 1's API contract

export const mockOverview = {
  total_posts: 500,
  average_engagement_rate: 6.82,
  total_engagement: 45231,
  best_content_type: "Reel",
  best_topic: "Behind the Scenes",
  best_posting_time: "19:00-21:00"
};

export const mockContentTypes = {
  data: [
    {
      content_type: "Reel",
      post_count: 180,
      average_engagement_rate: 8.2,
      median_engagement_rate: 7.9
    },
    {
      content_type: "Carousel",
      post_count: 145,
      average_engagement_rate: 7.1,
      median_engagement_rate: 6.8
    },
    {
      content_type: "Single Image",
      post_count: 110,
      average_engagement_rate: 5.4,
      median_engagement_rate: 5.1
    },
    {
      content_type: "Video (Long)",
      post_count: 45,
      average_engagement_rate: 4.8,
      median_engagement_rate: 4.5
    },
    {
      content_type: "Text / Quote",
      post_count: 20,
      average_engagement_rate: 3.9,
      median_engagement_rate: 3.6
    }
  ]
};

export const mockTopics = {
  data: [
    {
      topic: "Behind the Scenes",
      post_count: 95,
      average_engagement_rate: 8.6,
      median_engagement_rate: 8.2
    },
    {
      topic: "Product",
      post_count: 80,
      average_engagement_rate: 7.4,
      median_engagement_rate: 7.1
    },
    {
      topic: "Tutorial & Tips",
      post_count: 120,
      average_engagement_rate: 7.2,
      median_engagement_rate: 6.9
    },
    {
      topic: "Industry Insights",
      post_count: 65,
      average_engagement_rate: 6.3,
      median_engagement_rate: 6.0
    },
    {
      topic: "User Testimonials",
      post_count: 75,
      average_engagement_rate: 5.8,
      median_engagement_rate: 5.5
    },
    {
      topic: "Company Culture",
      post_count: 65,
      average_engagement_rate: 4.9,
      median_engagement_rate: 4.7
    }
  ]
};

export const mockTiming = {
  day_data: [
    { day: "Monday", average_engagement_rate: 5.8 },
    { day: "Tuesday", average_engagement_rate: 6.3 },
    { day: "Wednesday", average_engagement_rate: 7.1 },
    { day: "Thursday", average_engagement_rate: 7.4 },
    { day: "Friday", average_engagement_rate: 6.9 },
    { day: "Saturday", average_engagement_rate: 8.4 },
    { day: "Sunday", average_engagement_rate: 7.9 }
  ],
  hour_data: [
    { hour: 0, average_engagement_rate: 2.1 },
    { hour: 2, average_engagement_rate: 1.5 },
    { hour: 4, average_engagement_rate: 1.2 },
    { hour: 6, average_engagement_rate: 2.8 },
    { hour: 8, average_engagement_rate: 4.5 },
    { hour: 10, average_engagement_rate: 5.9 },
    { hour: 12, average_engagement_rate: 6.8 },
    { hour: 14, average_engagement_rate: 6.1 },
    { hour: 16, average_engagement_rate: 6.9 },
    { hour: 18, average_engagement_rate: 7.8 },
    { hour: 19, average_engagement_rate: 8.2 },
    { hour: 20, average_engagement_rate: 8.1 },
    { hour: 21, average_engagement_rate: 7.5 },
    { hour: 22, average_engagement_rate: 5.6 },
    { hour: 23, average_engagement_rate: 3.4 }
  ]
};

export const mockTrends = {
  trends: [
    { date: "2026-07-01", engagement_rate: 5.4, posts: 12, total_engagement: 2900 },
    { date: "2026-07-08", engagement_rate: 5.9, posts: 15, total_engagement: 3400 },
    { date: "2026-07-15", engagement_rate: 6.2, posts: 18, total_engagement: 4100 },
    { date: "2026-07-22", engagement_rate: 6.7, posts: 16, total_engagement: 4600 },
    { date: "2026-07-29", engagement_rate: 6.4, posts: 14, total_engagement: 4300 },
    { date: "2026-08-05", engagement_rate: 7.2, posts: 20, total_engagement: 5800 },
    { date: "2026-08-12", engagement_rate: 7.8, posts: 22, total_engagement: 6700 },
    { date: "2026-08-15", engagement_rate: 8.2, posts: 25, total_engagement: 7431 }
  ]
};

export const mockInsights = {
  insights: [
    {
      id: 1,
      type: "content",
      title: "Reels perform better",
      description: "Reels have higher engagement than image posts. Short-form video generates 52% more comments and 2.4x more saves.",
      impact: "high"
    },
    {
      id: 2,
      type: "timing",
      title: "Evening peak engagement window",
      description: "Posts published between 19:00 and 21:00 UTC outperform morning posts by an average of 41% in initial 2-hour reach.",
      impact: "high"
    },
    {
      id: 3,
      type: "topic",
      title: "Behind the Scenes drives authentic interest",
      description: "Behind the scenes content averages 8.6% engagement rate, outperforming promotional product showcases.",
      impact: "medium"
    },
    {
      id: 4,
      type: "format",
      title: "Carousel posts increase dwell time",
      description: "Multi-slide carousels achieve the lowest drop-off and second highest share rate across all audience segments.",
      impact: "medium"
    },
    {
      id: 5,
      type: "frequency",
      title: "Weekend audience spike",
      description: "Saturday posts experience a 23% higher engagement boost compared to early-week posts.",
      impact: "low"
    }
  ]
};

export const mockRecommendations = {
  recommendations: [
    {
      rank: 1,
      content_type: "Reel",
      topic: "Behind the Scenes",
      day: "Saturday",
      time_range: "19:00-21:00",
      score: 87,
      reasons: [
        "Reels have the highest average engagement rate (8.2%) across all formats.",
        "Behind the Scenes topic generates the strongest community resonance.",
        "Saturday evening is your historical highest-engagement traffic window."
      ]
    },
    {
      rank: 2,
      content_type: "Carousel",
      topic: "Tutorial & Tips",
      day: "Thursday",
      time_range: "18:00-20:00",
      score: 81,
      reasons: [
        "Tutorial carousels generate 3.2x more saves than single images.",
        "Thursday evenings demonstrate peak learning intent in your niche.",
        "High median engagement (6.9%) provides consistent predictable reach."
      ]
    },
    {
      rank: 3,
      content_type: "Reel",
      topic: "Product",
      day: "Wednesday",
      time_range: "19:00-21:00",
      score: 76,
      reasons: [
        "Product reels with quick demo cuts capture strong conversion rates.",
        "Mid-week evening slot captures active buyer discovery browsing."
      ]
    },
    {
      rank: 4,
      content_type: "Single Image",
      topic: "Industry Insights",
      day: "Tuesday",
      time_range: "12:00-14:00",
      score: 68,
      reasons: [
        "Lunchtime scrollers engage heavily with quick visual data graphics.",
        "Positioning as industry authority strengthens brand sentiment."
      ]
    }
  ]
};

export const mockPrediction = {
  prediction: "HIGH",
  probability: 0.78,
  model: "RandomForest",
  recommendations: [
    "Consider posting between 19:00 and 21:00.",
    "Include 3-5 targeted niche hashtags rather than generic tags.",
    "Keep caption length between 150-250 characters with a clear question CTA."
  ]
};

export const mockSimulation = {
  results: [
    {
      name: "Scenario A (Reel + Behind the Scenes)",
      prediction: "HIGH",
      probability: 0.84,
      model: "RandomForest",
      expected_engagement_rate: 8.6
    },
    {
      name: "Scenario B (Carousel + Tutorial)",
      prediction: "HIGH",
      probability: 0.76,
      model: "RandomForest",
      expected_engagement_rate: 7.2
    },
    {
      name: "Scenario C (Single Image + Product)",
      prediction: "MEDIUM",
      probability: 0.52,
      model: "RandomForest",
      expected_engagement_rate: 5.4
    },
    {
      name: "Scenario D (Text / Quote + Promo)",
      prediction: "LOW",
      probability: 0.28,
      model: "RandomForest",
      expected_engagement_rate: 3.8
    }
  ]
};

export const mockStrategy = {
  strategy: [
    {
      day: "Monday",
      content_type: "Educational",
      topic: "Tutorial",
      time_range: "18:00-20:00",
      score: 82
    },
    {
      day: "Tuesday",
      content_type: "Single Image",
      topic: "Industry Insights",
      time_range: "12:00-14:00",
      score: 74
    },
    {
      day: "Wednesday",
      content_type: "Carousel",
      topic: "Tutorial & Tips",
      time_range: "19:00-21:00",
      score: 85
    },
    {
      day: "Thursday",
      content_type: "Reel",
      topic: "Product",
      time_range: "18:00-20:00",
      score: 88
    },
    {
      day: "Friday",
      content_type: "Carousel",
      topic: "User Testimonials",
      time_range: "17:00-19:00",
      score: 79
    },
    {
      day: "Saturday",
      content_type: "Reel",
      topic: "Behind the Scenes",
      time_range: "19:00-21:00",
      score: 93
    },
    {
      day: "Sunday",
      content_type: "Single Image",
      topic: "Company Culture",
      time_range: "20:00-22:00",
      score: 71
    }
  ]
};

export const mockDatasets = [
  {
    id: "ds_01h9a8b7c6d5",
    filename: "instagram_creator_posts_2026.csv",
    created_at: "2026-08-10T14:32:00Z",
    total_rows: 500,
    total_columns: 12,
    missing_values: 4,
    duplicates: 0,
    status: "PROCESSED",
    file_size_bytes: 84520
  },
  {
    id: "ds_02k4m5n6p7q8",
    filename: "linkedin_q2_campaigns.csv",
    created_at: "2026-07-28T09:15:00Z",
    total_rows: 320,
    total_columns: 10,
    missing_values: 0,
    duplicates: 2,
    status: "PROCESSED",
    file_size_bytes: 52140
  }
];

export const mockUser = {
  id: "usr_99812",
  email: "creator@contentiq.io",
  name: "Alex Rivera",
  role: "Content Strategist",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  company: "Aura Media Labs",
  created_at: "2026-01-15T08:00:00Z"
};
