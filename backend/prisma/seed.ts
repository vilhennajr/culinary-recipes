import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const categories = [
    { name: 'Bolos e tortas doces' },
    { name: 'Carnes' },
    { name: 'Aves' },
    { name: 'Peixes e frutos do mar' },
    { name: 'Saladas, molhos e acompanhamentos' },
    { name: 'Sopas' },
    { name: 'Massas' },
    { name: 'Bebidas' },
    { name: 'Doces e sobremesas' },
    { name: 'Lanches' },
    { name: 'Prato Único' },
    { name: 'Light' },
    { name: 'Alimentação Saudável' },
  ];

  console.log('Creating categories...');
  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { login: 'maria.silva@example.com' },
    update: {},
    create: {
      name: 'Maria Silva',
      login: 'maria.silva@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { login: 'joao.santos@example.com' },
    update: {},
    create: {
      name: 'João Santos',
      login: 'joao.santos@example.com',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { login: 'ana.costa@example.com' },
    update: {},
    create: {
      name: 'Ana Costa',
      login: 'ana.costa@example.com',
      password: hashedPassword,
    },
  });

  const cakesCategory = createdCategories.find((c) => c.name === 'Bolos e tortas doces');
  const meatCategory = createdCategories.find((c) => c.name === 'Carnes');
  const poultryCategory = createdCategories.find((c) => c.name === 'Aves');
  const seafoodCategory = createdCategories.find((c) => c.name === 'Peixes e frutos do mar');
  const saladsCategory = createdCategories.find((c) => c.name === 'Saladas, molhos e acompanhamentos');
  const soupsCategory = createdCategories.find((c) => c.name === 'Sopas');
  const pastaCategory = createdCategories.find((c) => c.name === 'Massas');
  const beveragesCategory = createdCategories.find((c) => c.name === 'Bebidas');
  const sweetsCategory = createdCategories.find((c) => c.name === 'Doces e sobremesas');
  const snacksCategory = createdCategories.find((c) => c.name === 'Lanches');
  const onePotCategory = createdCategories.find((c) => c.name === 'Prato Único');
  const lightCategory = createdCategories.find((c) => c.name === 'Light');
  const healthyCategory = createdCategories.find((c) => c.name === 'Alimentação Saudável');

  console.log('Creating recipes...');

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: cakesCategory?.id,
      name: 'Bolo de Chocolate',
      preparationTimeMinutes: 60,
      servings: 12,
      preparationMethod:
        '1. Pré-aqueça o forno a 180°C\n2. Em uma tigela, misture a farinha, o açúcar e o cacau\n3. Em outra tigela, bata os ovos com o óleo e o leite\n4. Una as misturas e mexa delicadamente\n5. Despeje em uma forma untada\n6. Asse por 40 minutos ou até que um palito saia limpo',
      ingredients:
        '2 xícaras de farinha de trigo\n1½ xícaras de açúcar\n¾ xícara de cacau em pó\n3 ovos\n1 xícara de leite\n½ xícara de óleo\n1 colher de sopa de fermento em pó',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: meatCategory?.id,
      name: 'Bife à Parmegiana',
      preparationTimeMinutes: 45,
      servings: 4,
      preparationMethod:
        '1. Tempere os bifes com sal e alho\n2. Passe na farinha, depois no ovo batido e na farinha de rosca\n3. Frite em óleo quente até dourar\n4. Coloque em refratário, cubra com molho de tomate e queijo\n5. Leve ao forno a 200°C por 15 minutos até o queijo derreter',
      ingredients:
        '4 bifes de contrafilé\n2 ovos batidos\n1 xícara de farinha de rosca\nSal e alho a gosto\n2 xícaras de molho de tomate\n200g de queijo mussarela\n100g de queijo parmesão',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: poultryCategory?.id,
      name: 'Frango Assado com Ervas',
      preparationTimeMinutes: 90,
      servings: 6,
      preparationMethod:
        '1. Tempere o frango com sal, pimenta, alho e suco de limão\n2. Marine por 30 minutos\n3. Coloque em assadeira com batatas ao redor\n4. Regue com azeite e salpique as ervas\n5. Asse a 200°C por 60 minutos, virando na metade do tempo',
      ingredients:
        '1 frango inteiro (cerca de 1,5kg)\n4 batatas médias cortadas\n4 dentes de alho amassados\n2 limões (suco)\nAlecrim, tomilho e manjericão frescos\nAzeite, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: pastaCategory?.id,
      name: 'Espaguete à Carbonara',
      preparationTimeMinutes: 25,
      servings: 4,
      preparationMethod:
        '1. Cozinhe o espaguete em água fervente com sal\n2. Frite o bacon até ficar crocante\n3. Bata os ovos com o queijo ralado\n4. Escorra a massa e misture rapidamente com o bacon e os ovos\n5. O calor da massa cozinhará os ovos\n6. Sirva imediatamente com pimenta-do-reino',
      ingredients:
        '400g de espaguete\n200g de bacon em cubos\n4 ovos\n100g de queijo parmesão ralado\nSal e pimenta-do-reino a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: sweetsCategory?.id,
      name: 'Pudim de Leite Condensado',
      preparationTimeMinutes: 70,
      servings: 10,
      preparationMethod:
        '1. Faça a calda: derreta o açúcar em fogo baixo até caramelizar\n2. Despeje na forma e espalhe\n3. No liquidificador, bata o leite condensado, o leite e os ovos\n4. Despeje sobre a calda\n5. Asse em banho-maria a 180°C por 50 minutos\n6. Deixe esfriar e desenforme frio',
      ingredients:
        '1 lata de leite condensado\n2 latas de leite (mesma medida da lata de leite condensado)\n4 ovos\n1 xícara de açúcar para a calda',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: snacksCategory?.id,
      name: 'Hambúrguer Artesanal',
      preparationTimeMinutes: 30,
      servings: 4,
      preparationMethod:
        '1. Misture a carne moída com a cebola, alho, sal e pimenta\n2. Forme 4 hambúrgueres\n3. Grelhe por 5 minutos de cada lado\n4. Monte o hambúrguer: pão, alface, hambúrguer, queijo, tomate e molho\n5. Sirva quente',
      ingredients:
        '500g de carne moída\n1 cebola picada\n2 dentes de alho amassados\n4 pães de hambúrguer\n4 fatias de queijo\nAlface e tomate\nMolho de sua preferência\nSal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: beveragesCategory?.id,
      name: 'Suco Verde Detox',
      preparationTimeMinutes: 10,
      servings: 2,
      preparationMethod:
        '1. Lave bem todos os ingredientes\n2. Bata no liquidificador com a água\n3. Coe se preferir\n4. Sirva gelado',
      ingredients:
        '2 folhas de couve\n1 maçã verde\n½ limão (suco)\n1 pedaço pequeno de gengibre\n200ml de água gelada\nMel a gosto (opcional)',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: healthyCategory?.id,
      name: 'Salada de Quinoa',
      preparationTimeMinutes: 20,
      servings: 4,
      preparationMethod:
        '1. Cozinhe a quinoa em água fervente por 15 minutos\n2. Escorra e deixe esfriar\n3. Misture com os legumes picados\n4. Tempere com azeite, limão, sal e pimenta\n5. Sirva fresco',
      ingredients:
        '1 xícara de quinoa\n1 pepino picado\n2 tomates picados\n1 pimentão amarelo picado\nCebolinha verde picada\nAzeite, suco de limão, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: seafoodCategory?.id,
      name: 'Camarão ao Alho e Óleo',
      preparationTimeMinutes: 20,
      servings: 4,
      preparationMethod:
        '1. Tempere os camarões com sal, pimenta e suco de limão\n2. Aquecer o azeite e refogar o alho até dourar\n3. Adicione os camarões e refogue por 3 minutos de cada lado\n4. Finalize com salsínha e sirva com arroz',
      ingredients:
        '500g de camarões limpos\n4 dentes de alho picados\n4 colheres de sopa de azeite\nSuco de 1 limão\nSalsínha picada\nSal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: seafoodCategory?.id,
      name: 'Filé de Tilápia Grelhado',
      preparationTimeMinutes: 25,
      servings: 2,
      preparationMethod:
        '1. Tempere os filés com sal, pimenta, alho e limão\n2. Deixe marinar por 10 minutos\n3. Aquecer a frigideira com azeite em fogo médio-alto\n4. Grelhe os filés por 4 minutos de cada lado\n5. Sirva com legumes cozidos',
      ingredients:
        '2 filés de tilápia\n2 dentes de alho amassados\nSuco de 1 limão\n2 colheres de sopa de azeite\nSal, pimenta e ervas finas a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: soupsCategory?.id,
      name: 'Caldo Verde',
      preparationTimeMinutes: 40,
      servings: 6,
      preparationMethod:
        '1. Refogue a cebola e o alho no azeite\n2. Adicione as batatas cortadas e o caldo de legumes\n3. Cozinhe por 20 minutos e bata com mixer\n4. Junte a couve fatiada finamente e o linguiça\n5. Cozinhe mais 5 minutos e sirva quente',
      ingredients:
        '4 batatas médias\n1 maciço de couve\n200g de linguiça calabresa fatiada\n1 cebola picada\n2 dentes de alho\n1,5L de caldo de legumes\nAzeite, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: soupsCategory?.id,
      name: 'Sopa de Legúmes',
      preparationTimeMinutes: 35,
      servings: 6,
      preparationMethod:
        '1. Refogue a cebola e o alho no azeite\n2. Adicione todos os legumes picados em cubos\n3. Cubra com água e cozinhe por 25 minutos\n4. Tempere com sal, pimenta e cheiro-verde\n5. Sirva quente',
      ingredients:
        '2 cenouras\n2 abobrinha\n1 batata-doce\n1 cebola\n2 dentes de alho\n1 talo de salsão\nCheiro-verde, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: saladsCategory?.id,
      name: 'Vinagrete Clássico',
      preparationTimeMinutes: 10,
      servings: 6,
      preparationMethod:
        '1. Pique o tomate, a cebola e o pimentão em cubos pequenos\n2. Misture todos os ingredientes em uma tigela\n3. Tempere com azeite, vinégre, sal e pimenta\n4. Misture bem e deixe descansar 10 minutos antes de servir',
      ingredients:
        '3 tomates\n1 cebola\n1 pimentão verde\nSalsínha picada\n3 colheres de sopa de azeite\n2 colheres de sopa de vinégre\nSal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: onePotCategory?.id,
      name: 'Feijoada Completa',
      preparationTimeMinutes: 180,
      servings: 10,
      preparationMethod:
        '1. Deixe o feijão de molho na véspera\n2. Refogue o alho e a cebola na banha\n3. Adicione as carnes e refogue bem\n4. Junte o feijão e cubra com água\n5. Cozinhe na panela de pressão por 40 minutos\n6. Ajuste o tempero e sirva com arroz, couve e farofa',
      ingredients:
        '500g de feijão preto\n300g de carne seca\n200g de linguiça calabresa\n200g de paio\n1 cebola\n4 dentes de alho\n2 folhas de louro\nSal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: onePotCategory?.id,
      name: 'Arroz com Frango',
      preparationTimeMinutes: 45,
      servings: 6,
      preparationMethod:
        '1. Tempere o frango com sal, alho e pimenta\n2. Frite o frango em óleo até dourar, reserve\n3. Refogue a cebola e o alho no mesmo óleo\n4. Adicione o tomate e refogue\n5. Junte o arroz lavado, o frango e cubra com água quente\n6. Cozinhe em fogo baixo até secar',
      ingredients:
        '500g de frango em pedaços\n2 xícaras de arroz\n1 cebola picada\n3 dentes de alho\n2 tomates picados\nCheiro-verde, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: lightCategory?.id,
      name: 'Wrap de Frango Grelhado',
      preparationTimeMinutes: 20,
      servings: 2,
      preparationMethod:
        '1. Tempere o frango com sal, pimenta e ervas\n2. Grelhe por 6 minutos de cada lado e fatie\n3. Monte o wrap com a tortilha, alface, tomate e o frango\n4. Adicione iogurte natural com limão como molho\n5. Enrole firmemente e sirva',
      ingredients:
        '2 filés de frango\n2 tortilhas integrais\nFolhas de alface\n1 tomate fatiado\nIogurte natural\nSuco de limão\nSal, pimenta e ervas a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: lightCategory?.id,
      name: 'Omelete de Legumes',
      preparationTimeMinutes: 15,
      servings: 1,
      preparationMethod:
        '1. Bata os ovos com sal e pimenta\n2. Refogue os legumes picados no azeite por 3 minutos\n3. Despeje os ovos sobre os legumes\n4. Cozinhe em fogo baixo com a frigideira tampada\n5. Dobre ao meio e sirva',
      ingredients:
        '3 ovos\n1/2 pimentão\n1/2 abobrinha\n1 tomate pequeno\n1 colher de azeite\nSal, pimenta e orégano a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user1.id,
      categoryId: pastaCategory?.id,
      name: 'Macarrão ao Molho Bolonhesa',
      preparationTimeMinutes: 50,
      servings: 6,
      preparationMethod:
        '1. Refogue a cebola e o alho no azeite\n2. Adicione a carne moída e cozinhe até dourar\n3. Junte o tomate pelado, a massa de tomate e os temperos\n4. Cozinhe em fogo baixo por 30 minutos\n5. Cozinhe o macarrão conforme instruções da embalagem\n6. Misture o molho com a massa e sirva',
      ingredients:
        '500g de macarrão penne\n400g de carne moída\n1 lata de tomate pelado\n2 colheres de massa de tomate\n1 cebola\n3 dentes de alho\nManjericão, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user3.id,
      categoryId: cakesCategory?.id,
      name: 'Bolo de Cenoura com Cobertura',
      preparationTimeMinutes: 55,
      servings: 12,
      preparationMethod:
        '1. Bata no liquidificador as cenouras, ovos e óleo\n2. Misture com a farinha, açúcar e fermento\n3. Despeje na forma untada e asse a 180°C por 40 minutos\n4. Para a cobertura, misture o cacau, a manteiga e o leite em fogo baixo\n5. Despeje sobre o bolo ainda quente',
      ingredients:
        '3 cenouras médias\n3 ovos\n1 xícara de óleo\n2 xícaras de farinha de trigo\n2 xícaras de açúcar\n1 colher de fermento\n4 colheres de cacau em pó\n2 colheres de manteiga\n4 colheres de leite',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: meatCategory?.id,
      name: 'Picanha na Churrasqueira',
      preparationTimeMinutes: 30,
      servings: 6,
      preparationMethod:
        '1. Deixe a carne em temperatura ambiente por 30 minutos\n2. Tempere generosamente com sal grosso apenas\n3. Coloque na grelha com a gordura para cima\n4. Asse por 15 minutos, vire e asse mais 10 minutos\n5. Deixe descansar 5 minutos antes de fatiar',
      ingredients:
        '1 peça de picanha (1,2kg)\nSal grosso a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: cakesCategory?.id,
      name: 'Torta de Limão',
      preparationTimeMinutes: 50,
      servings: 8,
      preparationMethod:
        '1. Triture os biscoitos e misture com a manteiga\n2. Forre uma forma e leve ao freezer por 10 minutos\n3. Misture o leite condensado com o suco de limão e as gemas\n4. Despeje sobre a base e leve ao forno a 180°C por 20 minutos\n5. Cubra com merengue e doure no forno',
      ingredients:
        '200g de biscoito maisena\n100g de manteiga derretida\n1 lata de leite condensado\nSuco de 3 limões\n3 gemas\n3 claras para merengue\n6 colheres de açúcar',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: poultryCategory?.id,
      name: 'Frango ao Curry',
      preparationTimeMinutes: 35,
      servings: 4,
      preparationMethod:
        '1. Tempere o frango com sal, pimenta e curry\n2. Refogue a cebola e o alho no azeite\n3. Adicione o frango e doure por 5 minutos\n4. Junte o leite de coco e cozinhe por 20 minutos\n5. Ajuste o sal e sirva com arroz branco',
      ingredients:
        '600g de frango em cubos\n1 lata de leite de coco\n1 cebola picada\n3 dentes de alho\n2 colheres de curry em pó\nAzeite, sal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: snacksCategory?.id,
      name: 'Coxinha de Frango',
      preparationTimeMinutes: 60,
      servings: 20,
      preparationMethod:
        '1. Cozinhe e desfie o frango, refogue com temperos\n2. Faça a massa: ferva o caldo com manteiga e sal, adicione a farinha de uma vez\n3. Sove até a massa soltar das mãos\n4. Modele as coxinhas, recheie e feche bem\n5. Passe no ovo batido e na farinha de rosca\n6. Frite em óleo quente até dourar',
      ingredients:
        '500g de frango cozido e desfiado\n2 xícaras de farinha de trigo\n500ml de caldo de frango\n2 colheres de manteiga\n1 cebola\n2 dentes de alho\nSal, pimenta e cheiro-verde a gosto\nFarinha de rosca para empanar',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: soupsCategory?.id,
      name: 'Sopa de Abóbora com Gengibre',
      preparationTimeMinutes: 30,
      servings: 4,
      preparationMethod:
        '1. Refogue a cebola, o alho e o gengibre no azeite\n2. Adicione a abóbora em cubos e o caldo de legumes\n3. Cozinhe por 20 minutos até amaciar\n4. Bata com mixer até ficar cremoso\n5. Ajuste o sal e sirva com sementes de abóbora',
      ingredients:
        '600g de abóbora cabotiá\n1 cebola\n2 dentes de alho\n1 pedaço de gengibre fresco\n600ml de caldo de legumes\nAzeite, sal e pimenta a gosto\nSementes de abóbora para decorar',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: pastaCategory?.id,
      name: 'Lasanha à Bolonhesa',
      preparationTimeMinutes: 80,
      servings: 8,
      preparationMethod:
        '1. Prepare o molho bolonhesa com carne moída, tomates e temperos\n2. Prepare o molho branco com manteiga, farinha e leite\n3. Monte as camadas: molho, massa, bolonhesa, molho branco e queijo\n4. Repita as camadas\n5. Finalize com queijo ralado e asse a 200°C por 35 minutos',
      ingredients:
        '500g de massa de lasanha\n400g de carne moída\n1 lata de tomate pelado\n500ml de leite\n3 colheres de farinha\n3 colheres de manteiga\n200g de mussarela\n100g de parmesão\nSal, pimenta e ervas a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: beveragesCategory?.id,
      name: 'Limonada Suíça',
      preparationTimeMinutes: 10,
      servings: 4,
      preparationMethod:
        '1. Corte os limões e coloque no liquidificador com casca\n2. Adicione a água gelada, o leite condensado e o creme de leite\n3. Bata por alguns segundos (não bata muito para não amargar)\n4. Coe e sirva com gelo',
      ingredients:
        '4 limões\n500ml de água gelada\n1 lata de leite condensado\n1 caixinha de creme de leite\nGelo a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: sweetsCategory?.id,
      name: 'Brigadeiro Gourmet',
      preparationTimeMinutes: 30,
      servings: 30,
      preparationMethod:
        '1. Misture o leite condensado, o cacau e a manteiga em panela\n2. Cozinhe em fogo médio, mexendo sempre\n3. Quando soltar do fundo, desligue\n4. Deixe esfriar completamente\n5. Unte as mãos com manteiga e enrole as bolinhas\n6. Passe no granulado e coloque em forminhas',
      ingredients:
        '1 lata de leite condensado\n4 colheres de cacau em pó\n1 colher de manteiga sem sal\nGranulado de chocolate para cobrir',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: meatCategory?.id,
      name: 'Costela Assada no Forno',
      preparationTimeMinutes: 240,
      servings: 6,
      preparationMethod:
        '1. Tempere a costela com sal, pimenta, alho e ervas\n2. Embrulhe em papel alumínio\n3. Asse a 160°C por 3 horas\n4. Abra o papel e asse mais 30 minutos para dourar\n5. Sirva com farofa e mandioca',
      ingredients:
        '1,5kg de costela bovina\n4 dentes de alho amassados\nAlecrim e tomilho frescos\nSal grosso e pimenta-do-reino a gosto\n3 colheres de azeite',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: lightCategory?.id,
      name: 'Bowl de Açaí',
      preparationTimeMinutes: 10,
      servings: 1,
      preparationMethod:
        '1. Bata o açaí congelado com a banana no liquidificador\n2. Adicione um pouco de leite de amêndoas se necessário\n3. Despeje no bowl\n4. Decore com granola, frutas frescas e mel',
      ingredients:
        '200g de polpa de açaí congelada\n1 banana congelada\n50ml de leite de amêndoas\n3 colheres de granola\nMorangos e kiwi fatiados\nMel a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: saladsCategory?.id,
      name: 'Guacamole Fresco',
      preparationTimeMinutes: 10,
      servings: 4,
      preparationMethod:
        '1. Amasse os abacates com um garfo até obter uma pasta\n2. Adicione o suco de limão para não escurecer\n3. Misture a cebola, o tomate e o coentro picados\n4. Tempere com sal, pimenta e pimenta dedo-de-moça\n5. Sirva imediatamente com tortilhas',
      ingredients:
        '2 abacates maduros\nSuco de 1 limão\n1/2 cebola roxa picada\n1 tomate sem sementes picado\nCoentro fresco picado\n1/2 pimenta dedo-de-moça\nSal e pimenta a gosto',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: onePotCategory?.id,
      name: 'Risoto de Cogumelos',
      preparationTimeMinutes: 40,
      servings: 4,
      preparationMethod:
        '1. Aqueça o caldo de legumes separadamente\n2. Refogue a cebola e o alho no azeite\n3. Adicione o arroz arbóreo e toste por 2 minutos\n4. Acrescente o vinho branco e mexa até absorver\n5. Adicione o caldo quente concha a concha, mexendo sempre\n6. Junte os cogumelos salteados e o parmesão ao final',
      ingredients:
        '300g de arroz arbóreo\n300g de cogumelos frescos\n1L de caldo de legumes quente\n1 copo de vinho branco seco\n1 cebola picada\n2 dentes de alho\n100g de parmesão ralado\n2 colheres de manteiga',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: healthyCategory?.id,
      name: 'Panqueca de Banana com Aveia',
      preparationTimeMinutes: 15,
      servings: 2,
      preparationMethod:
        '1. Amasse a banana e misture com os ovos e a aveia\n2. Adicione uma pitada de sal e canela\n3. Aqueça uma frigideira antiaderente com fio de azeite\n4. Despeje porções da massa e cozinhe 2 minutos de cada lado\n5. Sirva com mel e frutas',
      ingredients:
        '2 bananas maduras\n2 ovos\n4 colheres de aveia em flocos\n1 pitada de sal\n1 pitada de canela\nMel e frutas para servir',
    },
  });

  await prisma.recipe.create({
    data: {
      userId: user2.id,
      categoryId: seafoodCategory?.id,
      name: 'Moqueca de Peixe Baiana',
      preparationTimeMinutes: 40,
      servings: 4,
      preparationMethod:
        '1. Tempere os filés com sal, limão e pimenta\n2. Aqueça o azeite de dendê e refogue a cebola e o alho\n3. Adicione o tomate, o pimentão e o leite de coco\n4. Junte os filés e cozinhe por 15 minutos em fogo baixo\n5. Finalize com azeite de dendê e coentro fresco',
      ingredients:
        '600g de filé de peixe branco\n1 lata de leite de coco\n2 colheres de azeite de dendê\n1 cebola em rodelas\n2 tomates em rodelas\n1 pimentão vermelho\n1 pimentão verde\nCoentro fresco, sal e pimenta a gosto',
    },
  });
  console.log('Sample users (password for all: password123):');
  console.log('- maria.silva@example.com');
  console.log('- joao.santos@example.com');
  console.log('- ana.costa@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
