// NOTE: Deprecated. Use prisma/seed.ts as the canonical seed script.
// This script keeps a minimal example of mapping from raw SQL-like data.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.person.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@primeinfluencer.com',
      password: '$2a$10$rGvH4hzU8KvZ5hQvKZ0zMuKvZ5hQvKZ0zMuKvZ5hQvKZ0zMuKvZ5hQ', // password123
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create categories
  console.log('📁 Creating categories...');
  const categories = [
    { name: 'Lifestyle & Travel', description: 'Beauty, lifestyle, and travel content' },
    { name: 'Technology', description: 'Tech reviews and gadget showcases' },
    { name: 'Entertainment', description: 'Dance, comedy, and entertainment content' },
    { name: 'Food & Travel', description: 'Food reviews and travel experiences' },
    { name: 'Health & Wellness', description: 'Yoga, fitness, and wellness coaching' },
    { name: 'Automotive', description: 'Car reviews and motorsports content' },
    { name: 'DIY & Crafts', description: 'DIY projects and home decor' },
    { name: 'Gaming', description: 'Gaming streams and esports commentary' },
    { name: 'Fashion & Sustainability', description: 'Fashion and ethical manufacturing' },
    { name: 'Adventure Travel', description: 'Adventure travel and eco-tourism' },
  ];

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  // Create people (individuals)
  console.log('👥 Creating individuals...');
  const individuals = [
    {
      recordId: 'IND-001',
      recordType: 'INDIVIDUAL',
      fullName: 'Somchai Prasert',
      preferredName: 'Somchai',
      gender: 'M',
      birthDate: new Date('1984-03-12'),
      email: 'somchai.prasert@example.com',
      phone: '+66-80-123-4567',
      city: 'Bangkok',
      country: 'Thailand',
      occupation: 'Marketing Manager',
      totalFollowersCount: 1800,
      interests: 'Fitness, Coffee',
      notes: 'Interested in supporting campaign logistics',
      secondaryPlatform: 'LinkedIn',
      secondaryFollowersCount: 1800,
      averageMonthlyReach: 5400,
      collaborationStatus: 'CONTACTED',
      languages: 'TH,EN',
      portfolioUrl: 'https://profiles.example.com/somchai-prasert',
      lastContactDate: new Date('2024-05-03'),
      createdById: adminUser.id,
    },
    {
      recordId: 'IND-002',
      recordType: 'INDIVIDUAL',
      fullName: 'Sudarat Wongwan',
      preferredName: 'Bee',
      gender: 'F',
      birthDate: new Date('1990-11-08'),
      email: 'sudarat.w@example.com',
      phone: '+66-85-222-1199',
      city: 'Chiang Mai',
      country: 'Thailand',
      occupation: 'Graphic Designer',
      totalFollowersCount: 950,
      interests: 'Art, Sustainable living',
      notes: 'Prefers remote collaboration schedules',
      secondaryPlatform: 'Behance',
      secondaryFollowersCount: 950,
      averageMonthlyReach: 2700,
      collaborationStatus: 'PROSPECT',
      languages: 'TH,EN',
      portfolioUrl: 'https://portfolio.example.com/sudarat-w',
      lastContactDate: new Date('2024-04-28'),
      createdById: adminUser.id,
    },
  ];

  for (const individual of individuals) {
    await prisma.person.create({ data: individual });
  }

  // Create people (influencers)
  console.log('⭐ Creating influencers...');
  const influencers = [
    {
      recordId: 'INF-011',
      recordType: 'INFLUENCER',
      fullName: 'Napasorn Kittiya',
      preferredName: 'Napa',
      gender: 'F',
      birthDate: new Date('1996-06-14'),
      email: 'napasorn.kittiya@example.com',
      phone: '+66-90-452-1180',
      city: 'Bangkok',
      country: 'Thailand',
      occupation: 'Lifestyle Influencer',
      influencerCategory: 'Lifestyle & Travel',
      primaryPlatform: 'Instagram',
      followersCount: 185000,
      totalFollowersCount: 267000,
      engagementRate: 0.048,
      engagementRateTier: 'LOW',
      interests: 'Beauty, Travel',
      notes: 'Collaborated with regional skincare brands',
      secondaryPlatform: 'YouTube',
      secondaryFollowersCount: 82000,
      averageMonthlyReach: 960000,
      collaborationStatus: 'ACTIVE',
      languages: 'TH,EN',
      portfolioUrl: 'https://insta.example.com/napasorn',
      lastContactDate: new Date('2024-05-12'),
      createdById: adminUser.id,
    },
    {
      recordId: 'INF-012',
      recordType: 'INFLUENCER',
      fullName: 'Pattarapon Yodsakul',
      preferredName: 'Pat',
      gender: 'M',
      birthDate: new Date('1991-08-02'),
      email: 'pattarapon.y@example.com',
      phone: '+66-81-300-4577',
      city: 'Bangkok',
      country: 'Thailand',
      occupation: 'Tech Reviewer',
      influencerCategory: 'Technology',
      primaryPlatform: 'YouTube',
      followersCount: 320000,
      totalFollowersCount: 1060000,
      engagementRate: 0.062,
      engagementRateTier: 'MEDIUM',
      interests: 'Gadget reviews, Tech news',
      notes: 'Hosts weekly livestream gadget showcases',
      secondaryPlatform: 'Facebook',
      secondaryFollowersCount: 740000,
      averageMonthlyReach: 1120000,
      collaborationStatus: 'ACTIVE',
      languages: 'TH,EN',
      portfolioUrl: 'https://youtube.example.com/pattarapon',
      lastContactDate: new Date('2024-05-09'),
      createdById: adminUser.id,
    },
    {
      recordId: 'INF-013',
      recordType: 'INFLUENCER',
      fullName: 'Supakrit Limsiri',
      preferredName: 'Krit',
      gender: 'M',
      birthDate: new Date('1995-03-19'),
      email: 'supakrit.l@example.com',
      phone: '+66-94-730-8822',
      city: 'Chiang Mai',
      country: 'Thailand',
      occupation: 'Content Creator',
      influencerCategory: 'Entertainment',
      primaryPlatform: 'TikTok',
      followersCount: 410000,
      totalFollowersCount: 930000,
      engagementRate: 0.072,
      engagementRateTier: 'HIGH',
      interests: 'Dance, Comedy skits',
      notes: 'Known for viral choreography challenges',
      secondaryPlatform: 'Instagram',
      secondaryFollowersCount: 520000,
      averageMonthlyReach: 1180000,
      collaborationStatus: 'ACTIVE',
      languages: 'TH',
      portfolioUrl: 'https://tiktok.example.com/supakrit',
      lastContactDate: new Date('2024-05-08'),
      createdById: adminUser.id,
    },
    {
      recordId: 'INF-014',
      recordType: 'INFLUENCER',
      fullName: 'Lalita Chanapai',
      preferredName: 'Lita',
      gender: 'F',
      birthDate: new Date('1993-09-27'),
      email: 'lalita.c@example.com',
      phone: '+66-83-199-6644',
      city: 'Khon Kaen',
      country: 'Thailand',
      occupation: 'Food Blogger',
      influencerCategory: 'Food & Travel',
      primaryPlatform: 'Facebook',
      followersCount: 150000,
      totalFollowersCount: 410000,
      engagementRate: 0.038,
      engagementRateTier: 'LOW',
      interests: 'Food reviews, Local travel',
      notes: 'Curates monthly food tour series',
      secondaryPlatform: 'YouTube',
      secondaryFollowersCount: 260000,
      averageMonthlyReach: 680000,
      collaborationStatus: 'PAUSED',
      languages: 'TH,EN',
      portfolioUrl: 'https://foodjourney.example.com/lalita',
      lastContactDate: new Date('2024-04-30'),
      createdById: adminUser.id,
    },
    {
      recordId: 'INF-015',
      recordType: 'INFLUENCER',
      fullName: 'Prangthip Sae-Li',
      preferredName: 'Prang',
      gender: 'F',
      birthDate: new Date('1998-12-05'),
      email: 'prangthip.s@example.com',
      phone: '+66-92-504-7788',
      city: 'Phuket',
      country: 'Thailand',
      occupation: 'Wellness Coach',
      influencerCategory: 'Health & Wellness',
      primaryPlatform: 'Instagram',
      followersCount: 98000,
      totalFollowersCount: 243000,
      engagementRate: 0.055,
      engagementRateTier: 'MEDIUM',
      interests: 'Yoga, Wellness lifestyle',
      notes: 'Offers branded mindfulness workshops',
      secondaryPlatform: 'TikTok',
      secondaryFollowersCount: 145000,
      averageMonthlyReach: 310000,
      collaborationStatus: 'ACTIVE',
      languages: 'TH,EN',
      portfolioUrl: 'https://wellness.example.com/prangthip',
      lastContactDate: new Date('2024-05-06'),
      createdById: adminUser.id,
    },
  ];

  for (const influencer of influencers) {
    await prisma.person.create({ data: influencer });
  }

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created:');
  console.log(`   - 1 admin user`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${individuals.length} individuals`);
  console.log(`   - ${influencers.length} influencers`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
