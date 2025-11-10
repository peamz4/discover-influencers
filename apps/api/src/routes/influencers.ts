import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';
import logger from '../lib/logger';

const router = Router();

// Get all influencers with filtering and pagination
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      city,
      engagementTier,
      status,
      collaborationStatus,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      minFollowers,
      maxFollowers,
      minEngagementRate,
      maxEngagementRate,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      recordType: 'INFLUENCER', // Only get influencers
    };
    if (category) where.influencerCategory = category;
    if (city) where.city = city;
    if (engagementTier) where.engagementRateTier = engagementTier;
    if (status) where.status = status;
    if (collaborationStatus) where.collaborationStatus = collaborationStatus;
    
    // Numeric range filters
    if (minFollowers || maxFollowers) {
      where.followersCount = {};
      if (minFollowers) where.followersCount.gte = parseInt(minFollowers as string);
      if (maxFollowers) where.followersCount.lte = parseInt(maxFollowers as string);
    }
    if (minEngagementRate || maxEngagementRate) {
      where.engagementRate = {};
      if (minEngagementRate) where.engagementRate.gte = parseFloat(minEngagementRate as string);
      if (maxEngagementRate) where.engagementRate.lte = parseFloat(maxEngagementRate as string);
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [influencers, total] = await Promise.all([
      prisma.person.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy as string]: order },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.person.count({ where }),
    ]);

    // Transform database fields to match frontend expectations
    const transformedInfluencers = influencers.map(inf => ({
      id: inf.id,
      name: inf.fullName,
      email: inf.email,
      phone: inf.phone,
      category: inf.influencerCategory,
      city: inf.city,
      country: inf.country,
      followers: inf.followersCount || inf.totalFollowersCount || 0,
      engagementRate: inf.engagementRate,
      engagementTier: inf.engagementRateTier,
      platform: inf.primaryPlatform,
      collaborationStatus: inf.collaborationStatus,
      notes: inf.notes,
      avatarUrl: inf.portfolioUrl,
      status: inf.status,
      createdAt: inf.createdAt,
      updatedAt: inf.updatedAt,
      createdBy: inf.createdBy,
    }));

    res.json({
      data: transformedInfluencers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Get influencers error:', error);
    res.status(500).json({ error: 'Failed to fetch influencers' });
  }
});

// Get influencer by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const influencer = await prisma.person.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!influencer || influencer.recordType !== 'INFLUENCER') {
      res.status(404).json({ error: 'Influencer not found' });
      return;
    }

    // Transform database fields to match frontend expectations
    const transformed = {
      id: influencer.id,
      name: influencer.fullName,
      email: influencer.email,
      phone: influencer.phone,
      category: influencer.influencerCategory,
      city: influencer.city,
      country: influencer.country,
      followers: influencer.followersCount || influencer.totalFollowersCount || 0,
      engagementRate: influencer.engagementRate,
      engagementTier: influencer.engagementRateTier,
      platform: influencer.primaryPlatform,
      collaborationStatus: influencer.collaborationStatus,
      notes: influencer.notes,
      avatarUrl: influencer.portfolioUrl,
      status: influencer.status,
      createdAt: influencer.createdAt,
      updatedAt: influencer.updatedAt,
      createdBy: influencer.createdBy,
    };

    res.json(transformed);
  } catch (error) {
    logger.error('Get influencer error:', error);
    res.status(500).json({ error: 'Failed to fetch influencer' });
  }
});

// Create influencer (EDITOR or ADMIN only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('followers').optional().isInt({ min: 0 }).withMessage('Followers must be positive'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Transform frontend fields to database fields
      const {
        name,
        email,
        phone,
        category,
        city,
        country,
        followers,
        engagementRate,
        engagementTier,
        platform,
        collaborationStatus,
        notes,
        status,
      } = req.body;

      // Ensure category exists
      if (category) {
        const existingCategory = await prisma.category.findUnique({
          where: { name: category }
        });
        
        if (!existingCategory) {
          await prisma.category.create({
            data: {
              name: category,
              description: `${category} category`
            }
          });
        }
      }

      const influencer = await prisma.person.create({
        data: {
          recordType: 'INFLUENCER',
          recordId: `INF-${Date.now()}`, // Generate unique ID
          fullName: name,
          email,
          phone,
          influencerCategory: category,
          city,
          country,
          followersCount: followers,
          engagementRate,
          engagementRateTier: engagementTier,
          primaryPlatform: platform,
          collaborationStatus,
          notes,
          status: status || 'ACTIVE',
          createdById: req.user?.userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Influencer created: ${influencer.fullName} by ${req.user?.email}`);

      // Transform response
      const transformed = {
        id: influencer.id,
        name: influencer.fullName,
        email: influencer.email,
        phone: influencer.phone,
        category: influencer.influencerCategory,
        city: influencer.city,
        country: influencer.country,
        followers: influencer.followersCount || 0,
        engagementRate: influencer.engagementRate,
        engagementTier: influencer.engagementRateTier,
        platform: influencer.primaryPlatform,
        collaborationStatus: influencer.collaborationStatus,
        notes: influencer.notes,
        status: influencer.status,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
        createdBy: influencer.createdBy,
      };

      res.status(201).json(transformed);
    } catch (error: any) {
      logger.error('Create influencer error:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Influencer with this email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create influencer' });
      }
    }
  }
);

// Update influencer (EDITOR or ADMIN only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if influencer exists
      const existing = await prisma.person.findUnique({
        where: { id },
      });

      if (!existing || existing.recordType !== 'INFLUENCER') {
        res.status(404).json({ error: 'Influencer not found' });
        return;
      }

      // Transform frontend fields to database fields
      const {
        name,
        email,
        phone,
        category,
        city,
        country,
        followers,
        engagementRate,
        engagementTier,
        platform,
        collaborationStatus,
        notes,
        status,
      } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.fullName = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (category !== undefined) updateData.influencerCategory = category;
      if (city !== undefined) updateData.city = city;
      if (country !== undefined) updateData.country = country;
      if (followers !== undefined) updateData.followersCount = followers;
      if (engagementRate !== undefined) updateData.engagementRate = engagementRate;
      if (engagementTier !== undefined) updateData.engagementRateTier = engagementTier;
      if (platform !== undefined) updateData.primaryPlatform = platform;
      if (collaborationStatus !== undefined) updateData.collaborationStatus = collaborationStatus;
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;

      const influencer = await prisma.person.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Influencer updated: ${influencer.fullName} by ${req.user?.email}`);

      // Transform response
      const transformed = {
        id: influencer.id,
        name: influencer.fullName,
        email: influencer.email,
        phone: influencer.phone,
        category: influencer.influencerCategory,
        city: influencer.city,
        country: influencer.country,
        followers: influencer.followersCount || 0,
        engagementRate: influencer.engagementRate,
        engagementTier: influencer.engagementRateTier,
        platform: influencer.primaryPlatform,
        collaborationStatus: influencer.collaborationStatus,
        notes: influencer.notes,
        status: influencer.status,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
        createdBy: influencer.createdBy,
      };

      res.json(transformed);
    } catch (error: any) {
      logger.error('Update influencer error:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Influencer with this email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update influencer' });
      }
    }
  }
);

// Delete influencer (ADMIN only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if influencer exists
      const existing = await prisma.person.findUnique({
        where: { id },
      });

      if (!existing || existing.recordType !== 'INFLUENCER') {
        res.status(404).json({ error: 'Influencer not found' });
        return;
      }

      await prisma.person.delete({
        where: { id },
      });

      logger.info(`Influencer deleted: ${existing.fullName} by ${req.user?.email}`);

      res.json({ message: 'Influencer deleted successfully' });
    } catch (error) {
      logger.error('Delete influencer error:', error);
      res.status(500).json({ error: 'Failed to delete influencer' });
    }
  }
);

// Sync metrics from external API (mock)
router.post(
  '/:id/sync-metrics',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if influencer exists
      const existing = await prisma.person.findUnique({
        where: { id },
      });

      if (!existing || existing.recordType !== 'INFLUENCER') {
        res.status(404).json({ error: 'Influencer not found' });
        return;
      }

      // Simulate external API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock external API response with randomized updates
      const currentFollowers = existing.followersCount || 10000;
      const followerGrowth = Math.floor(Math.random() * 1000) - 200; // -200 to +800
      const newFollowers = Math.max(0, currentFollowers + followerGrowth);
      
      // Engagement rate fluctuation (±0.5%)
      const currentRate = existing.engagementRate || 0.05;
      const rateChange = (Math.random() - 0.5) * 0.01; // -0.005 to +0.005
      const newEngagementRate = Math.max(0, Math.min(1, currentRate + rateChange));
      
      // Determine new tier based on rate
      let newTier: 'LOW' | 'MEDIUM' | 'HIGH';
      if (newEngagementRate < 0.03) {
        newTier = 'LOW';
      } else if (newEngagementRate < 0.06) {
        newTier = 'MEDIUM';
      } else {
        newTier = 'HIGH';
      }

      // Update influencer with mock data
      const updated = await prisma.person.update({
        where: { id },
        data: {
          followersCount: newFollowers,
          engagementRate: newEngagementRate,
          engagementRateTier: newTier,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Metrics synced for influencer: ${updated.fullName} by ${req.user?.email}`);

      // Transform response
      const transformed = {
        id: updated.id,
        name: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        category: updated.influencerCategory,
        city: updated.city,
        country: updated.country,
        followers: updated.followersCount || 0,
        engagementRate: updated.engagementRate,
        engagementTier: updated.engagementRateTier,
        platform: updated.primaryPlatform,
        collaborationStatus: updated.collaborationStatus,
        notes: updated.notes,
        status: updated.status,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        createdBy: updated.createdBy,
        syncInfo: {
          previousFollowers: currentFollowers,
          followerChange: followerGrowth,
          previousEngagementRate: currentRate,
          engagementRateChange: rateChange,
          syncedAt: new Date().toISOString(),
        },
      };

      res.json(transformed);
    } catch (error: any) {
      logger.error('Sync metrics error:', error);
      res.status(500).json({ error: 'Failed to sync metrics' });
    }
  }
);

// Get influencer stats (analytics)
router.get('/analytics/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const where = { recordType: 'INFLUENCER' as const };
    
    const [
      totalInfluencers,
      activeInfluencers,
      influencers,
      categoryCounts,
      tierCounts,
      statusCounts,
    ] = await Promise.all([
      prisma.person.count({ where }),
      prisma.person.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.person.findMany({
        where,
        select: {
          followersCount: true,
          totalFollowersCount: true,
          engagementRate: true,
        },
      }),
      prisma.person.groupBy({
        by: ['influencerCategory'],
        where,
        _count: { _all: true },
      }),
      prisma.person.groupBy({
        by: ['engagementRateTier'],
        where,
        _count: { _all: true },
      }),
      prisma.person.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),
    ]);

    // Calculate total followers
    const totalFollowers = influencers.reduce((sum, inf) => {
      return sum + (inf.followersCount || inf.totalFollowersCount || 0);
    }, 0);

    // Calculate average engagement rate (returned as percentage with one decimal)
    const ratesWithValue = influencers.filter(inf => inf.engagementRate != null);
    const avgEngagementRatePct = ratesWithValue.length > 0
      ? (ratesWithValue.reduce((sum, inf) => sum + (inf.engagementRate || 0), 0) / ratesWithValue.length) * 100
      : 0;

    res.json({
      totalInfluencers,
      activeInfluencers,
      totalFollowers,
      // one decimal place percentage (e.g., 5.4 for 5.4%)
      avgEngagementRate: Math.round(avgEngagementRatePct * 10) / 10,
      byCategory: categoryCounts.map(c => ({ category: c.influencerCategory || 'Uncategorized', count: c._count._all })),
      byTier: tierCounts.map(t => ({ engagementRateTier: t.engagementRateTier || 'UNSPECIFIED', count: t._count._all })),
      byStatus: statusCounts.map(s => ({ status: s.status, count: s._count._all })),
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;

