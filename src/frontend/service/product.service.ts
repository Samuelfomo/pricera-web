import type { Product } from '@/frontend/view/product.vue';

export default class ProductService {
  static async getAll(): Promise<Product[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/product/list`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Vérification structure
      if (data.status && Array.isArray(data.response?.products)) {
        return data.response.products.map((p: any): Product => {
          // Logique pour le nom du produit
          let productName = p.commercialName;
          if (!productName && p.nomenclatures?.items?.length > 0) {
            productName = p.nomenclatures.items[0]; // Prendre la première nomenclature
          }
          if (!productName) {
            productName = `Produit-${p.guid}`; // Fallback final
          }

          return {
            id: p.guid,
            barcode: p.barcode ?? "",
            name: productName,
            image: p.images?.items?.[0] ?? null,
            universes: p.universes?.items?.map((u: any) => ({
              nom: u.name,
              sectors: u.sectors?.items?.map((s: any) => ({
                nom: s.name,
                description: s.description
              })) ?? []
            })) ?? [],
            nomenclatures: p.nomenclatures?.items ?? []
          };
        });
      } else {
        console.error("Structure inattendue:", data);
        return [];
      }

    } catch (error) {
      console.error("Erreur dans ProductService.getAll:", error);
      throw error;
    }
  }
}