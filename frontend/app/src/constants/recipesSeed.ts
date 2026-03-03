import type { CreateRecipePayload } from '../types';

export interface RecipeSeedItem extends CreateRecipePayload {
  categoryId: string | null;
}

export const RECIPES_SEED: RecipeSeedItem[] = [
  {
    name: 'Bolo de Chocolate',
    categoryId: 'bolos-e-tortas-doces',
    preparationTimeMinutes: 60,
    servings: 12,
    preparationMethod:
      '1. Pré-aqueça o forno a 180°C\n2. Em uma tigela, misture a farinha, o açúcar e o cacau\n3. Em outra tigela, bata os ovos com o óleo e o leite\n4. Una as misturas e mexa delicadamente\n5. Despeje em uma forma untada\n6. Asse por 40 minutos ou até que um palito saia limpo',
    ingredients:
      '2 xícaras de farinha de trigo\n1½ xícaras de açúcar\n¾ xícara de cacau em pó\n3 ovos\n1 xícara de leite\n½ xícara de óleo\n1 colher de sopa de fermento em pó',
  },
  {
    name: 'Bolo de Cenoura com Cobertura',
    categoryId: 'bolos-e-tortas-doces',
    preparationTimeMinutes: 55,
    servings: 12,
    preparationMethod:
      '1. Bata no liquidificador as cenouras, ovos e óleo\n2. Misture com a farinha, açúcar e fermento\n3. Despeje na forma untada e asse a 180°C por 40 minutos\n4. Para a cobertura, misture o cacau, a manteiga e o leite em fogo baixo\n5. Despeje sobre o bolo ainda quente',
    ingredients:
      '3 cenouras médias\n3 ovos\n1 xícara de óleo\n2 xícaras de farinha de trigo\n2 xícaras de açúcar\n1 colher de fermento\n4 colheres de cacau em pó\n2 colheres de manteiga\n4 colheres de leite',
  },
  {
    name: 'Torta de Limão',
    categoryId: 'bolos-e-tortas-doces',
    preparationTimeMinutes: 50,
    servings: 8,
    preparationMethod:
      '1. Triture os biscoitos e misture com a manteiga\n2. Forre uma forma e leve ao freezer por 10 minutos\n3. Misture o leite condensado com o suco de limão e as gemas\n4. Despeje sobre a base e leve ao forno a 180°C por 20 minutos\n5. Cubra com merengue e doure no forno',
    ingredients:
      '200g de biscoito maisena\n100g de manteiga derretida\n1 lata de leite condensado\nSuco de 3 limões\n3 gemas\n3 claras para merengue\n6 colheres de açúcar',
  },
  {
    name: 'Bife à Parmegiana',
    categoryId: 'carnes',
    preparationTimeMinutes: 45,
    servings: 4,
    preparationMethod:
      '1. Tempere os bifes com sal e alho\n2. Passe na farinha, depois no ovo batido e na farinha de rosca\n3. Frite em óleo quente até dourar\n4. Coloque em refratário, cubra com molho de tomate e queijo\n5. Leve ao forno a 200°C por 15 minutos até o queijo derreter',
    ingredients:
      '4 bifes de contrafilé\n2 ovos batidos\n1 xícara de farinha de rosca\nSal e alho a gosto\n2 xícaras de molho de tomate\n200g de queijo mussarela\n100g de queijo parmesão',
  },
  {
    name: 'Picanha na Churrasqueira',
    categoryId: 'carnes',
    preparationTimeMinutes: 30,
    servings: 6,
    preparationMethod:
      '1. Deixe a carne em temperatura ambiente por 30 minutos\n2. Tempere generosamente com sal grosso apenas\n3. Coloque na grelha com a gordura para cima\n4. Asse por 15 minutos, vire e asse mais 10 minutos\n5. Deixe descansar 5 minutos antes de fatiar',
    ingredients: '1 peça de picanha (1,2kg)\nSal grosso a gosto',
  },
  {
    name: 'Costela Assada no Forno',
    categoryId: 'carnes',
    preparationTimeMinutes: 240,
    servings: 6,
    preparationMethod:
      '1. Tempere a costela com sal, pimenta, alho e ervas\n2. Embrulhe em papel alumínio\n3. Asse a 160°C por 3 horas\n4. Abra o papel e asse mais 30 minutos para dourar\n5. Sirva com farofa e mandioca',
    ingredients:
      '1,5kg de costela bovina\n4 dentes de alho amassados\nAlecrim e tomilho frescos\nSal grosso e pimenta-do-reino a gosto\n3 colheres de azeite',
  },
  {
    name: 'Frango Assado com Ervas',
    categoryId: 'aves',
    preparationTimeMinutes: 90,
    servings: 6,
    preparationMethod:
      '1. Tempere o frango com sal, pimenta, alho e suco de limão\n2. Marine por 30 minutos\n3. Coloque em assadeira com batatas ao redor\n4. Regue com azeite e salpique as ervas\n5. Asse a 200°C por 60 minutos, virando na metade do tempo',
    ingredients:
      '1 frango inteiro (cerca de 1,5kg)\n4 batatas médias cortadas\n4 dentes de alho amassados\n2 limões (suco)\nAlecrim, tomilho e manjericão frescos\nAzeite, sal e pimenta a gosto',
  },
  {
    name: 'Frango ao Curry',
    categoryId: 'aves',
    preparationTimeMinutes: 35,
    servings: 4,
    preparationMethod:
      '1. Tempere o frango com sal, pimenta e curry\n2. Refogue a cebola e o alho no azeite\n3. Adicione o frango e doure por 5 minutos\n4. Junte o leite de coco e cozinhe por 20 minutos\n5. Ajuste o sal e sirva com arroz branco',
    ingredients:
      '600g de frango em cubos\n1 lata de leite de coco\n1 cebola picada\n3 dentes de alho\n2 colheres de curry em pó\nAzeite, sal e pimenta a gosto',
  },
  {
    name: 'Camarão ao Alho e Óleo',
    categoryId: 'peixes-e-frutos-do-mar',
    preparationTimeMinutes: 20,
    servings: 4,
    preparationMethod:
      '1. Tempere os camarões com sal, pimenta e suco de limão\n2. Aqueça o azeite e refogue o alho até dourar\n3. Adicione os camarões e refogue por 3 minutos de cada lado\n4. Finalize com salsinha e sirva com arroz',
    ingredients:
      '500g de camarões limpos\n4 dentes de alho picados\n4 colheres de sopa de azeite\nSuco de 1 limão\nSalsinha picada\nSal e pimenta a gosto',
  },
  {
    name: 'Moqueca de Peixe Baiana',
    categoryId: 'peixes-e-frutos-do-mar',
    preparationTimeMinutes: 40,
    servings: 4,
    preparationMethod:
      '1. Tempere os filés com sal, limão e pimenta\n2. Aqueça o azeite de dendê e refogue a cebola e o alho\n3. Adicione o tomate, o pimentão e o leite de coco\n4. Junte os filés e cozinhe por 15 minutos em fogo baixo\n5. Finalize com azeite de dendê e coentro fresco',
    ingredients:
      '600g de filé de peixe branco\n1 lata de leite de coco\n2 colheres de azeite de dendê\n1 cebola em rodelas\n2 tomates em rodelas\n1 pimentão vermelho\n1 pimentão verde\nCoentro fresco, sal e pimenta a gosto',
  },
  {
    name: 'Vinagrete Clássico',
    categoryId: 'saladas-molhos-e-acompanhamentos',
    preparationTimeMinutes: 10,
    servings: 6,
    preparationMethod:
      '1. Pique o tomate, a cebola e o pimentão em cubos pequenos\n2. Misture todos os ingredientes em uma tigela\n3. Tempere com azeite, vinagre, sal e pimenta\n4. Misture bem e deixe descansar 10 minutos antes de servir',
    ingredients:
      '3 tomates\n1 cebola\n1 pimentão verde\nSalsinha picada\n3 colheres de sopa de azeite\n2 colheres de sopa de vinagre\nSal e pimenta a gosto',
  },
  {
    name: 'Guacamole Fresco',
    categoryId: 'saladas-molhos-e-acompanhamentos',
    preparationTimeMinutes: 10,
    servings: 4,
    preparationMethod:
      '1. Amasse os abacates com um garfo até obter uma pasta\n2. Adicione o suco de limão para não escurecer\n3. Misture a cebola, o tomate e o coentro picados\n4. Tempere com sal, pimenta e pimenta dedo-de-moça\n5. Sirva imediatamente com tortilhas',
    ingredients:
      '2 abacates maduros\nSuco de 1 limão\n1/2 cebola roxa picada\n1 tomate sem sementes picado\nCoentro fresco picado\n1/2 pimenta dedo-de-moça\nSal e pimenta a gosto',
  },
  {
    name: 'Caldo Verde',
    categoryId: 'sopas',
    preparationTimeMinutes: 40,
    servings: 6,
    preparationMethod:
      '1. Refogue a cebola e o alho no azeite\n2. Adicione as batatas cortadas e o caldo de legumes\n3. Cozinhe por 20 minutos e bata com mixer\n4. Junte a couve fatiada finamente e a linguiça\n5. Cozinhe mais 5 minutos e sirva quente',
    ingredients:
      '4 batatas médias\n1 maço de couve\n200g de linguiça calabresa fatiada\n1 cebola picada\n2 dentes de alho\n1,5L de caldo de legumes\nAzeite, sal e pimenta a gosto',
  },
  {
    name: 'Espaguete à Carbonara',
    categoryId: 'massas',
    preparationTimeMinutes: 25,
    servings: 4,
    preparationMethod:
      '1. Cozinhe o espaguete em água fervente com sal\n2. Frite o bacon até ficar crocante\n3. Bata os ovos com o queijo ralado\n4. Escorra a massa e misture rapidamente com o bacon e os ovos\n5. O calor da massa cozinhará os ovos\n6. Sirva imediatamente com pimenta-do-reino',
    ingredients:
      '400g de espaguete\n200g de bacon em cubos\n4 ovos\n100g de queijo parmesão ralado\nSal e pimenta-do-reino a gosto',
  },
  {
    name: 'Macarrão ao Molho Bolonhesa',
    categoryId: 'massas',
    preparationTimeMinutes: 50,
    servings: 6,
    preparationMethod:
      '1. Refogue a cebola e o alho no azeite\n2. Adicione a carne moída e cozinhe até dourar\n3. Junte o tomate pelado, a massa de tomate e os temperos\n4. Cozinhe em fogo baixo por 30 minutos\n5. Cozinhe o macarrão conforme instruções da embalagem\n6. Misture o molho com a massa e sirva',
    ingredients:
      '500g de macarrão penne\n400g de carne moída\n1 lata de tomate pelado\n2 colheres de massa de tomate\n1 cebola\n3 dentes de alho\nManjericão, sal e pimenta a gosto',
  },
  {
    name: 'Suco Verde Detox',
    categoryId: 'bebidas',
    preparationTimeMinutes: 10,
    servings: 2,
    preparationMethod:
      '1. Lave bem todos os ingredientes\n2. Bata no liquidificador com a água\n3. Coe se preferir\n4. Sirva gelado',
    ingredients:
      '2 folhas de couve\n1 maçã verde\n½ limão (suco)\n1 pedaço pequeno de gengibre\n200ml de água gelada\nMel a gosto (opcional)',
  },
  {
    name: 'Pudim de Leite Condensado',
    categoryId: 'doces-e-sobremesas',
    preparationTimeMinutes: 70,
    servings: 10,
    preparationMethod:
      '1. Faça a calda: derreta o açúcar em fogo baixo até caramelizar\n2. Despeje na forma e espalhe\n3. No liquidificador, bata o leite condensado, o leite e os ovos\n4. Despeje sobre a calda\n5. Asse em banho-maria a 180°C por 50 minutos\n6. Deixe esfriar e desenforme frio',
    ingredients:
      '1 lata de leite condensado\n2 latas de leite (mesma medida da lata de leite condensado)\n4 ovos\n1 xícara de açúcar para a calda',
  },
  {
    name: 'Hambúrguer Artesanal',
    categoryId: 'lanches',
    preparationTimeMinutes: 30,
    servings: 4,
    preparationMethod:
      '1. Misture a carne moída com a cebola, alho, sal e pimenta\n2. Forme 4 hambúrgueres\n3. Grelhe por 5 minutos de cada lado\n4. Monte o hambúrguer: pão, alface, hambúrguer, queijo, tomate e molho\n5. Sirva quente',
    ingredients:
      '500g de carne moída\n1 cebola picada\n2 dentes de alho amassados\n4 pães de hambúrguer\n4 fatias de queijo\nAlface e tomate\nMolho de sua preferência\nSal e pimenta a gosto',
  },
  {
    name: 'Feijoada Completa',
    categoryId: 'prato-unico',
    preparationTimeMinutes: 180,
    servings: 10,
    preparationMethod:
      '1. Deixe o feijão de molho na véspera\n2. Refogue o alho e a cebola na banha\n3. Adicione as carnes e refogue bem\n4. Junte o feijão e cubra com água\n5. Cozinhe na panela de pressão por 40 minutos\n6. Ajuste o tempero e sirva com arroz, couve e farofa',
    ingredients:
      '500g de feijão preto\n300g de carne seca\n200g de linguiça calabresa\n200g de paio\n1 cebola\n4 dentes de alho\n2 folhas de louro\nSal e pimenta a gosto',
  },
  {
    name: 'Salada de Quinoa',
    categoryId: 'alimentacao-saudavel',
    preparationTimeMinutes: 20,
    servings: 4,
    preparationMethod:
      '1. Cozinhe a quinoa em água fervente por 15 minutos\n2. Escorra e deixe esfriar\n3. Misture com os legumes picados\n4. Tempere com azeite, limão, sal e pimenta\n5. Sirva fresco',
    ingredients:
      '1 xícara de quinoa\n1 pepino picado\n2 tomates picados\n1 pimentão amarelo picado\nCebolinha verde picada\nAzeite, suco de limão, sal e pimenta a gosto',
  },
];
