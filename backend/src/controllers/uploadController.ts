// UploadController Formula:
// UploadController = POST /api/upload/image -> multer.single('image') -> SaveFile -> ReturnURL

import { Request, Response, NextFunction } from 'express';

export class UploadController {
  // POST /upload/image
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Return the URL path
      const imageUrl = `/uploads/images/${req.file.filename}`;

      res.status(201).json({
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      next(error);
    }
  }
}