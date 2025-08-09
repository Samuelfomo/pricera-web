// import { Request, Response, NextFunction } from 'express';
// import R from '../tools/response';
// import HttpStatus from '../tools/https-status';
//
// /**
//  * Middleware de validation et de sécurité pour les routes
//  */
// class EnsuredFetch {
//   /**
//    * Validation pour les requêtes GET
//    */
//   get() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // Validation des headers
//         this.validateHeaders(req);
//
//         // Validation des paramètres de requête
//         this.validateQueryParams(req);
//
//         // Log de la requête
//         console.log(`GET ${req.path} - IP: ${req.ip}`);
//
//         next();
//       } catch (error: any) {
//         console.error('Erreur validation GET:', error.message);
//         R.handleError(res, HttpStatus.BAD_REQUEST, {
//           code: 'validation_failed',
//           message: error.message
//         });
//       }
//     };
//   }
//
//   /**
//    * Validation pour les requêtes POST
//    */
//   post() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // Validation des headers
//         this.validateHeaders(req);
//
//         // Validation du content-type pour POST
//         if (!req.is('application/json')) {
//           throw new Error('Content-Type must be application/json');
//         }
//
//         // Validation du body
//         this.validateBody(req);
//
//         // Log de la requête
//         console.log(`POST ${req.path} - IP: ${req.ip}`);
//
//         next();
//       } catch (error: any) {
//         console.error('Erreur validation POST:', error.message);
//         R.handleError(res, HttpStatus.BAD_REQUEST, {
//           code: 'validation_failed',
//           message: error.message
//         });
//       }
//     };
//   }
//
//   /**
//    * Validation pour les requêtes PUT
//    */
//   put() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // Validation des headers
//         this.validateHeaders(req);
//
//         // Validation du content-type pour PUT
//         if (!req.is('application/json')) {
//           throw new Error('Content-Type must be application/json');
//         }
//
//         // Validation du body
//         this.validateBody(req);
//
//         // Validation des paramètres d'URL
//         this.validateUrlParams(req);
//
//         // Log de la requête
//         console.log(`PUT ${req.path} - IP: ${req.ip}`);
//
//         next();
//       } catch (error: any) {
//         console.error('Erreur validation PUT:', error.message);
//         R.handleError(res, HttpStatus.BAD_REQUEST, {
//           code: 'validation_failed',
//           message: error.message
//         });
//       }
//     };
//   }
//
//   /**
//    * Validation pour les requêtes DELETE
//    */
//   delete() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // Validation des headers
//         this.validateHeaders(req);
//
//         // Validation des paramètres d'URL
//         this.validateUrlParams(req);
//
//         // Log de la requête
//         console.log(`DELETE ${req.path} - IP: ${req.ip}`);
//
//         next();
//       } catch (error: any) {
//         console.error('Erreur validation DELETE:', error.message);
//         R.handleError(res, HttpStatus.BAD_REQUEST, {
//           code: 'validation_failed',
//           message: error.message
//         });
//       }
//     };
//   }
//
//   /**
//    * Validation des headers communs
//    */
//   private validateHeaders(req: Request): void {
//     // Vérification User-Agent
//     if (!req.get('User-Agent')) {
//       throw new Error('User-Agent header is required');
//     }
//
//     // Vérification des headers de sécurité
//     const suspiciousHeaders = ['X-Forwarded-For', 'X-Real-IP'];
//     suspiciousHeaders.forEach(header => {
//       const value = req.get(header);
//       if (value && this.containsSuspiciousContent(value)) {
//         throw new Error(`Invalid ${header} header`);
//       }
//     });
//   }
//
//   /**
//    * Validation des paramètres de requête
//    */
//   private validateQueryParams(req: Request): void {
//     const query = req.query;
//
//     // Vérification des paramètres suspects
//     for (const [key, value] of Object.entries(query)) {
//       if (typeof value === 'string' && this.containsSuspiciousContent(value)) {
//         throw new Error(`Invalid query parameter: ${key}`);
//       }
//     }
//   }
//
//   /**
//    * Validation du body de requête
//    */
//   private validateBody(req: Request): void {
//     const body = req.body;
//
//     if (!body || typeof body !== 'object') {
//       throw new Error('Request body must be a valid JSON object');
//     }
//
//     // Vérification récursive du contenu
//     this.validateObjectContent(body);
//   }
//
//   /**
//    * Validation des paramètres d'URL
//    */
//   private validateUrlParams(req: Request): void {
//     const params = req.params;
//
//     for (const [key, value] of Object.entries(params)) {
//       if (this.containsSuspiciousContent(value)) {
//         throw new Error(`Invalid URL parameter: ${key}`);
//       }
//     }
//   }
//
//   /**
//    * Validation récursive du contenu d'un objet
//    */
//   private validateObjectContent(obj: any): void {
//     if (typeof obj === 'string') {
//       if (this.containsSuspiciousContent(obj)) {
//         throw new Error('Suspicious content detected in request');
//       }
//     } else if (typeof obj === 'object' && obj !== null) {
//       for (const value of Object.values(obj)) {
//         this.validateObjectContent(value);
//       }
//     }
//   }
//
//   /**
//    * Détection de contenu suspect
//    */
//   private containsSuspiciousContent(value: string): boolean {
//     const suspiciousPatterns = [
//       /<script/i,
//       /javascript:/i,
//       /on\w+\s*=/i,
//       /eval\s*\(/i,
//       /expression\s*\(/i,
//       /vbscript:/i,
//       /data:text\/html/i,
//       /\.\.\/\.\./,
//       /\0/,
//       /\x00/
//     ];
//
//     return suspiciousPatterns.some(pattern => pattern.test(value));
//   }
// }
//
// // Export d'une instance singleton
// const Ensure = new EnsuredFetch();
// export default Ensure;