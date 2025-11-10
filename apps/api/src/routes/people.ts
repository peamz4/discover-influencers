import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';
import logger from '../lib/logger';

const router = Router();

// Get all people (individuals and influencers) with filtering and pagination
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      recordType,
      category,
      city,
      gender,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    if (recordType) where.recordType = recordType;
    if (category) where.influencerCategory = category;
    if (city) where.city = city;
    if (gender) where.gender = gender;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { occupation: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [people, total] = await Promise.all([
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

    res.json({
      data: people,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Get people error:', error);
    res.status(500).json({ error: 'Failed to fetch people' });
  }
});

// Get person by ID
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const person = await prisma.person.findUnique({
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

    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json(person);
  } catch (error) {
    logger.error('Get person error:', error);
    res.status(500).json({ error: 'Failed to fetch person' });
  }
});

// Create person (EDITOR or ADMIN only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('recordType').isIn(['INDIVIDUAL', 'INFLUENCER']).withMessage('Invalid record type'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        recordType,
        fullName,
        preferredName,
        gender,
        birthDate,
        email,
        phone,
        city,
        country,
        occupation,
        influencerCategory,
        primaryPlatform,
        followersCount,
        engagementRate,
        engagementRateTier,
        collaborationStatus,
        interests,
        notes,
        status,
      } = req.body;

      // Generate unique recordId
      const prefix = recordType === 'INFLUENCER' ? 'INF' : 'IND';
      const timestamp = Date.now();
      const recordId = `${prefix}-${timestamp}`;

      const person = await prisma.person.create({
        data: {
          recordId,
          recordType,
          fullName,
          preferredName,
          gender,
          birthDate: birthDate ? new Date(birthDate) : null,
          email,
          phone,
          city,
          country,
          occupation,
          influencerCategory,
          primaryPlatform,
          followersCount,
          engagementRate,
          engagementRateTier,
          collaborationStatus,
          interests,
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

      logger.info(`Person created: ${person.fullName} (${person.recordType}) by ${req.user?.email}`);
      res.status(201).json(person);
    } catch (error: any) {
      logger.error('Create person error:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Person with this email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create person' });
      }
    }
  }
);

// Update person (EDITOR or ADMIN only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if person exists
      const existing = await prisma.person.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }

      const updateData: any = {};
      const allowedFields = [
        'fullName', 'preferredName', 'gender', 'birthDate', 'email', 'phone',
        'city', 'country', 'occupation', 'influencerCategory', 'primaryPlatform',
        'followersCount', 'engagementRate', 'engagementRateTier', 'collaborationStatus',
        'interests', 'notes', 'status',
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'birthDate' && req.body[field]) {
            updateData[field] = new Date(req.body[field]);
          } else {
            updateData[field] = req.body[field];
          }
        }
      });

      const person = await prisma.person.update({
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

      logger.info(`Person updated: ${person.fullName} (${person.recordType}) by ${req.user?.email}`);
      res.json(person);
    } catch (error: any) {
      logger.error('Update person error:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Person with this email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update person' });
      }
    }
  }
);

// Delete person (ADMIN only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if person exists
      const existing = await prisma.person.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }

      await prisma.person.delete({
        where: { id },
      });

      logger.info(`Person deleted: ${existing.fullName} (${existing.recordType}) by ${req.user?.email}`);
      res.json({ message: 'Person deleted successfully' });
    } catch (error) {
      logger.error('Delete person error:', error);
      res.status(500).json({ error: 'Failed to delete person' });
    }
  }
);

export default router;
