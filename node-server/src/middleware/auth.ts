import type { NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.id) {
    return next(); // User is authenticated, continue to next middleware
  } else {
    if (req.baseUrl === '/attendee') {
      res.redirect('/attendee/login'); // User is not authenticated, redirect to login page
    } else {
      res.redirect('/organiser/login'); // User is not authenticated, redirect to login page
    }
  }
};

// Create role-based access control middleware
const verifyRole = (role) => {
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
