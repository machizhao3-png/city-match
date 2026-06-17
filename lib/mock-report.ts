export const mockReport = {
  city: "成都",
  matchScore: 88,
  tags: ["松弛感大师", "火锅社交型人格", "周末躺平冠军"],
  userProfile: {
    烟火气: 4.5,
    自然感: 3.2,
    文艺值: 3.8,
    搞钱值: 2.9,
    松弛度: 4.7,
    社交力: 4.1,
  },
  cityProfile: {
    烟火气: 4.8,
    自然感: 3.6,
    文艺值: 3.8,
    搞钱值: 3.2,
    松弛度: 4.6,
    社交力: 4.4,
  },
  reason:
    "你不是不想努力，只是更适合在有火锅、有朋友、有生活节奏的城市里努力。成都给你的不是躺平，而是一种有烟火气的松弛。",
};

export type CityReport = typeof mockReport;
export type Profile = Record<string, number>;