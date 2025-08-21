// import UserService from '../service/userService';
// import LocalStorageService from '../../backend/service/localStorageService';


export interface OtpValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export default class otpCtrl {
  /**
   * Valide le code OTP saisi par l'utilisateur
   */
  static validateOtp(otp: string): OtpValidationResult {
    const errors: string[] = [];

    // Vérifier si l'OTP est fourni
    if (!otp || otp.trim() === '') {
      errors.push('Le code OTP est requis');
      return { isValid: false, errors };
    }

    const trimmedOtp = otp.trim();

    // Vérifier si l'OTP contient uniquement des chiffres
    if (!/^\d+$/.test(trimmedOtp)) {
      errors.push('Le code OTP doit contenir uniquement des chiffres');
    }

    // Vérifier la longueur de l'OTP (généralement entre 4 et 8 chiffres)
    if (trimmedOtp.length < 4) {
      errors.push('Le code OTP doit contenir au moins 4 chiffres');
    }

    if (trimmedOtp.length > 8) {
      errors.push('Le code OTP ne peut pas dépasser 8 chiffres');
    }

    // Vérifier que l'OTP n'est pas une séquence évidente (comme 1234, 0000, etc.)
    if (this.isSequentialOrRepeated(trimmedOtp)) {
      errors.push('Le code OTP semble invalide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Vérifie si l'OTP est une séquence ou répétition évidente
   */
  private static isSequentialOrRepeated(otp: string): boolean {
    // Vérifier les répétitions (0000, 1111, etc.)
    if (new Set(otp).size === 1) {
      return true;
    }

    // Vérifier les séquences simples (1234, 4321, etc.)
    let isAscending = true;
    let isDescending = true;

    for (let i = 1; i < otp.length; i++) {
      const current = parseInt(otp[i]);
      const previous = parseInt(otp[i - 1]);

      if (current !== previous + 1) {
        isAscending = false;
      }
      if (current !== previous - 1) {
        isDescending = false;
      }
    }

    return isAscending || isDescending;
  }

  /**
   * Nettoie et formate l'OTP
   */
  static sanitizeOtp(otp: string): string {
    if (!otp) return '';
    // Supprimer tous les caractères non numériques et les espaces
    return otp.replace(/\D/g, '');
  }

  /**
   * Vérifie le code OTP auprès du serveur
   */
  // static async verifyOtp(otp: string): Promise<OtpVerificationResponse> {
  //   try {
  //     // Valider l'OTP localement d'abord
  //     const validation = this.validateOtp(otp);
  //     if (!validation.isValid) {
  //       return {
  //         success: false,
  //         message: 'Code OTP invalide',
  //         error: validation.errors.join(', ')
  //       };
  //     }
  //
  //     // Nettoyer l'OTP
  //     const cleanOtp = this.sanitizeOtp(otp);
  //     const otpNumber = parseInt(cleanOtp, 10);
  //
  //     // Appeler le service pour vérifier l'OTP
  //     const response = await UserService.updateUser(otpNumber);
  //
  //     if (response && response.success) {
  //       // Stocker les données utilisateur si la vérification réussit
  //       if (response.data) {
  //         await LocalStorageService.storeUserData(response.data);
  //       }
  //
  //       return {
  //         success: true,
  //         message: response.message || 'Code OTP vérifié avec succès',
  //         user: response.data
  //       };
  //     } else if (response) {
  //       return {
  //         success: false,
  //         message: response.message || 'Code OTP incorrect ou expiré',
  //         error: response.error || 'Vérification échouée'
  //       };
  //     } else {
  //       return {
  //         success: false,
  //         message: 'Erreur lors de la vérification du code OTP',
  //         error: 'Réponse du serveur invalide'
  //       };
  //     }
  //   } catch (error: any) {
  //     console.error('Erreur lors de la vérification de l\'OTP:', error);
  //
  //     // Analyser le type d'erreur pour fournir un message approprié
  //     let errorMessage = 'Une erreur est survenue lors de la vérification';
  //
  //     if (error.message) {
  //       if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
  //         errorMessage = 'Problème de connexion réseau. Vérifiez votre connexion internet.';
  //       } else if (error.message.includes('timeout')) {
  //         errorMessage = 'La vérification a pris trop de temps. Veuillez réessayer.';
  //       } else if (error.message.includes('404')) {
  //         errorMessage = 'Service de vérification non disponible.';
  //       } else if (error.message.includes('500')) {
  //         errorMessage = 'Erreur du serveur. Veuillez réessayer dans quelques minutes.';
  //       } else if (error.message.includes('expired') || error.message.includes('expiré')) {
  //         errorMessage = 'Le code OTP a expiré. Demandez un nouveau code.';
  //       } else if (error.message.includes('invalid') || error.message.includes('invalide')) {
  //         errorMessage = 'Code OTP incorrect. Vérifiez le code reçu par email.';
  //       } else {
  //         errorMessage = error.message;
  //       }
  //     }
  //
  //     return {
  //       success: false,
  //       message: errorMessage,
  //       error: error.message || 'Erreur de vérification'
  //     };
  //   }
  // }

  /**
   * Demande un nouveau code OTP
   */
  // static async requestNewOtp(email?: string): Promise<OtpVerificationResponse> {
  //   try {
  //     if (!email) {
  //       // Essayer de récupérer l'email depuis le localStorage ou une autre source
  //       const userData = LocalStorageService.getUserData();
  //       email = userData?.email;
  //     }
  //
  //     if (!email) {
  //       return {
  //         success: false,
  //         message: 'Impossible de renvoyer le code OTP',
  //         error: 'Adresse email non trouvée'
  //       };
  //     }
  //
  //     const response = await UserService.sendEmail(email);
  //
  //     if (response && response.success) {
  //       return {
  //         success: true,
  //         message: 'Un nouveau code OTP a été envoyé à votre adresse email'
  //       };
  //     } else {
  //       return {
  //         success: false,
  //         message: 'Erreur lors de l\'envoi du nouveau code OTP',
  //         error: response?.error || 'Erreur inconnue'
  //       };
  //     }
  //   } catch (error: any) {
  //     console.error('Erreur lors de la demande d\'un nouveau OTP:', error);
  //     return {
  //       success: false,
  //       message: 'Erreur lors de l\'envoi du nouveau code OTP',
  //       error: error.message || 'Erreur réseau'
  //     };
  //   }
  // }

  /**
   * Gère le succès de la vérification OTP
   */
  static handleVerificationSuccess(userData: any): void {
    console.log('Vérification OTP réussie:', userData);

    // Vous pouvez ajouter ici la logique après vérification réussie
    // comme la redirection, l'initialisation de l'application, etc.
  }

  /**
   * Gère les erreurs de vérification OTP
   */
  static handleVerificationError(error: string): void {
    console.error('Erreur de vérification OTP:', error);

    // Vous pouvez ajouter ici la logique de gestion d'erreurs
    // comme l'affichage de notifications, l'enregistrement des logs, etc.
  }

  /**
   * Formate l'affichage de l'OTP (avec espaces pour la lisibilité)
   */
  static formatOtpDisplay(otp: string): string {
    const cleanOtp = this.sanitizeOtp(otp);
    // Ajouter un espace tous les 2 chiffres pour la lisibilité
    return cleanOtp.replace(/(\d{2})(?=\d)/g, '$1 ');
  }

  /**
   * Vérifie si l'OTP est expiré (si vous stockez le timestamp)
   */
  static isOtpExpired(timestamp: number, expirationMinutes: number = 10): boolean {
    const now = Date.now();
    const expirationTime = timestamp + (expirationMinutes * 60 * 1000);
    return now > expirationTime;
  }
}