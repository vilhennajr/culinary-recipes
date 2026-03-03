export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'bolos-e-tortas-doces', name: 'Bolos e tortas doces' },
  { id: 'carnes', name: 'Carnes' },
  { id: 'aves', name: 'Aves' },
  { id: 'peixes-e-frutos-do-mar', name: 'Peixes e frutos do mar' },
  { id: 'saladas-molhos-e-acompanhamentos', name: 'Saladas, molhos e acompanhamentos' },
  { id: 'sopas', name: 'Sopas' },
  { id: 'massas', name: 'Massas' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'doces-e-sobremesas', name: 'Doces e sobremesas' },
  { id: 'lanches', name: 'Lanches' },
  { id: 'prato-unico', name: 'Prato Único' },
  { id: 'light', name: 'Light' },
  { id: 'alimentacao-saudavel', name: 'Alimentação Saudável' },
];
