// src/backend/service/localStorageService.ts

class LocalStorageService {
  private static readonly USER_KEY = 'user_data';
  private static readonly OTP_TIMESTAMP_KEY = 'otp_timestamp';

  /**
   * Stocke les données de l'utilisateur après vérification OTP
   */
  static storeUserData(data: any): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.USER_KEY, serialized);
      this.setOtpTimestamp(); // Enregistre le moment de la validation OTP
    } catch (err) {
      console.error('Erreur lors du stockage des données utilisateur :', err);
    }
  }

  /**
   * Récupère les données de l'utilisateur depuis le localStorage
   */
  static getUserData(): any | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur :', err);
      return null;
    }
  }

  /**
   * Supprime les données utilisateur (ex: lors d'une déconnexion)
   */
  static clearUserData(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.OTP_TIMESTAMP_KEY);
  }

  /**
   * Enregistre un timestamp lors de la vérification OTP
   */
  private static setOtpTimestamp(): void {
    localStorage.setItem(this.OTP_TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Récupère le timestamp de l'OTP (utile pour vérifier expiration)
   */
  static getOtpTimestamp(): number | null {
    const value = localStorage.getItem(this.OTP_TIMESTAMP_KEY);
    return value ? parseInt(value, 10) : null;
  }

  /**
   * Vérifie si l'OTP est expiré en fonction du timestamp
   */
  static isOtpExpired(expirationMinutes: number = 10): boolean {
    const timestamp = this.getOtpTimestamp();
    if (!timestamp) return true;
    const now = Date.now();
    const expirationTime = timestamp + expirationMinutes * 60 * 1000;
    return now > expirationTime;
  }

  /**
   * Vérifie si des données utilisateur sont présentes
   */
  static isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }
}

export default LocalStorageService;
