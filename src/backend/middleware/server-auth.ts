// import { Request, Response, NextFunction } from 'express';
// import R from '../tools/response';
//
//
// // Extension de l'interface Request pour inclure l'utilisateur
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: number;
//         email: string;
//         permissions: string[];
//         roles: string[];
//       };
//     }
//   }
// }
//
// /**
//  * Middleware d'authentification et d'autorisation
//  */
// export class ServerAuth {
//   /**
//    * Vérifie l'authentification de l'utilisateur
//    */
//   static authenticate() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const token = req.headers.authorization?.replace('Bearer ', '');
//
//         if (!token) {
//           return R.handleAuthError(res, 'Authentication token required');
//         }
//
//         // Simulation de validation de token
//         const user = ServerAuth.validateToken(token);
//
//         if (!user) {
//           return R.handleAuthError(res, 'Invalid or expired token');
//         }
//
//         // Ajout de l'utilisateur à la requête
//         req.user = user;
//         next();
//       } catch (error: any) {
//         console.error('Erreur authentification:', error.message);
//         R.handleAuthError(res, 'Authentication failed');
//       }
//     };
//   }
//
//   /**
//    * Vérifie qu'un utilisateur a une permission spécifique
//    */
//   static requirePermission(permission: string) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // Vérification de l'authentification d'abord
//         if (!req.user) {
//           return R.handleAuthError(res, 'Authentication required');
//         }
//
//         // Vérification de la permission
//         if (!ServerAuth.hasPermission(req.user, permission)) {
//           return R.handlePermissionError(res, `Permission '${permission}' required`);
//         }
//
//         console.log(`✅ Permission '${permission}' accordée à ${req.user.email}`);
//         next();
//       } catch (error: any) {
//         console.error('Erreur vérification permission:', error.message);
//         R.handlePermissionError(res, 'Permission check failed');
//       }
//     };
//   }
//
//   /**
//    * Vérifie qu'un utilisateur a un rôle spécifique
//    */
//   static requireRole(role: string) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         if (!req.user) {
//           return R.handleAuthError(res, 'Authentication required');
//         }
//
//         if (!ServerAuth.hasRole(req.user, role)) {
//           return R.handlePermissionError(res, `Role '${role}' required`);
//         }
//
//         console.log(`✅ Rôle '${role}' accordé à ${req.user.email}`);
//         next();
//       } catch (error: any) {
//         console.error('Erreur vérification rôle:', error.message);
//         R.handlePermissionError(res, 'Role check failed');
//       }
//     };
//   }
//
//   /**
//    * Vérifie qu'un utilisateur a au moins un des rôles spécifiés
//    */
//   static requireAnyRole(roles: string[]) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         if (!req.user) {
//           return R.handleAuthError(res, 'Authentication required');
//         }
//
//         const hasAnyRole = roles.some(role => ServerAuth.hasRole(req.user!, role));
//
//         if (!hasAnyRole) {
//           return R.handlePermissionError(res, `One of these roles required: ${roles.join(', ')}`);
//         }
//
//         next();
//       } catch (error: any) {
//         console.error('Erreur vérification rôles:', error.message);
//         R.handlePermissionError(res, 'Role check failed');
//       }
//     };
//   }
//
//   /**
//    * Middleware pour les routes d'administration
//    */
//   static requireAdmin() {
//     return ServerAuth.requireRole('admin');
//   }
//
//   /**
//    * Validation simulée d'un token JWT
//    */
//   private static validateToken(token: string): any {
//     // Simulation - dans un vrai projet, utilisez une librairie comme jsonwebtoken
//     if (token === 'valid-token') {
//       return {
//         id: 1,
//         email: 'admin@example.com',
//         permissions: ['postModule', 'editModule', 'deleteModule'],
//         roles: ['admin', 'user']
//       };
//     }
//
//     if (token === 'user-token') {
//       return {
//         id: 2,
//         email: 'user@example.com',
//         permissions: ['postModule'],
//         roles: ['user']
//       };
//     }
//
//     return null;
//   }
//
//   /**
//    * Vérifie si un utilisateur a une permission spécifique
//    */
//   private static hasPermission(user: any, permission: string): boolean {
//     return user.permissions?.includes(permission) || false;
//   }
//
//   /**
//    * Vérifie si un utilisateur a un rôle spécifique
//    */
//   private static hasRole(user: any, role: string): boolean {
//     return user.roles?.includes(role) || false;
//   }
//
//   /**
//    * Obtient l'utilisateur actuel depuis la requête
//    */
//   static getCurrentUser(req: Request): any {
//     return req.user;
//   }
//
//   /**
//    * Vérifie si l'utilisateur actuel est propriétaire d'une ressource
//    */
//   static isOwner(req: Request, resourceUserId: number): boolean {
//     return req.user?.id === resourceUserId;
//   }
//
//   /**
//    * Middleware combiné : authentification + permission
//    */
//   static authAndPermission(permission: string) {
//     return [
//       ServerAuth.authenticate(),
//       ServerAuth.requirePermission(permission)
//     ];
//   }
// }