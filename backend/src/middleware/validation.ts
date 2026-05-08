import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (err: any) {
      const errors = err.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      })) || [];
      return res.status(400).json({
        error: 'Validación fallida',
        details: errors
      });
    }
  };
}
