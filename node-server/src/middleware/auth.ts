import type { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.id) {
    return next(); // User is authenticated, continue to next middleware
  } else {
    res.status(401).json({ message: 'User not autenticated.' });
  }
};

// Create role-based access control middleware
const verifyRole = (role: 'ATTENDEE' | 'ORGANISER') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user || req.session.user.role !== role) {
      // User role doesn't match
      return next({
        status: 403,
        message: 'Sorry! You are not authorized to view this page.',
      });
    }

    // Authentication and authorization checks successful
    next();
  };
};

export { verifyRole, requireAuth };
