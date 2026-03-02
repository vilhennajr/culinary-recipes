import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Recipes (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;
  let userId: string;
  let categoryId: string;
  const timestamp = Date.now();
  const testLogin = `test-recipe-${timestamp}@example.com`;
  const testCategoryName = `Test Category ${timestamp}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();

    // Create a test user and get token
    const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({
      login: testLogin,
      password: 'password123',
      name: 'Lucas Ferreira',
    });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      login: testLogin,
      password: 'password123',
    });

    accessToken = loginResponse.body.accessToken;

    // Create a test category
    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: testCategoryName });

    categoryId = categoryResponse.body.id;
  });

  afterAll(async () => {
    // Clean only test data created by this suite
    await prismaService.recipe.deleteMany({ where: { userId } });
    await prismaService.category.deleteMany({ where: { name: testCategoryName } });
    await prismaService.user.deleteMany({ where: { id: userId } });
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/recipes (POST)', () => {
    it('should create a recipe with all fields', () => {
      return request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Chocolate Cake',
          categoryId: categoryId,
          preparationTimeMinutes: 60,
          servings: 8,
          preparationMethod: 'Mix ingredients and bake at 180°C for 40 minutes',
          ingredients: 'Flour, Sugar, Chocolate, Eggs, Butter',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Chocolate Cake');
          expect(res.body.categoryId).toBe(categoryId);
          expect(res.body.preparationTimeMinutes).toBe(60);
          expect(res.body.servings).toBe(8);
        });
    });

    it('should create a recipe with minimal fields', () => {
      return request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          preparationMethod: 'Simple preparation',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.preparationMethod).toBe('Simple preparation');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/recipes')
        .send({
          preparationMethod: 'Some method',
        })
        .expect(401);
    });

    it('should fail without preparationMethod', () => {
      return request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Invalid Recipe',
        })
        .expect(400);
    });
  });

  describe('/recipes (GET)', () => {
    let _recipeId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Recipe for Search',
          preparationMethod: 'Test method',
          preparationTimeMinutes: 30,
          servings: 4,
        });

      _recipeId = response.body.id;
    });

    it('should list recipes with pagination', () => {
      return request(app.getHttpServer())
        .get('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
          expect(res.body.meta).toHaveProperty('total');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter recipes by name', () => {
      return request(app.getHttpServer())
        .get('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ name: 'Test Recipe for Search' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].name).toContain('Test Recipe for Search');
        });
    });

    it('should filter recipes by preparationTimeMinutes range', () => {
      return request(app.getHttpServer())
        .get('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ minPreparationTime: 20, maxPreparationTime: 40 })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get('/recipes').expect(401);
    });
  });

  describe('/recipes/:id (GET)', () => {
    let recipeId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Recipe for Get by ID',
          preparationMethod: 'Method',
        });

      recipeId = response.body.id;
    });

    it('should get recipe by id', () => {
      return request(app.getHttpServer())
        .get(`/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(recipeId);
          expect(res.body.name).toBe('Recipe for Get by ID');
        });
    });

    it('should return 404 for non-existent recipe', () => {
      return request(app.getHttpServer())
        .get('/recipes/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/recipes/:id (PUT)', () => {
    let recipeId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Original Name',
          preparationMethod: 'Original method',
        });

      recipeId = response.body.id;
    });

    it('should update recipe', () => {
      return request(app.getHttpServer())
        .put(`/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Name',
          preparationMethod: 'Updated method',
          servings: 6,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Name');
          expect(res.body.preparationMethod).toBe('Updated method');
          expect(res.body.servings).toBe(6);
        });
    });

    it('should return 404 for non-existent recipe', () => {
      return request(app.getHttpServer())
        .put('/recipes/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated',
          preparationMethod: 'Updated',
        })
        .expect(404);
    });
  });

  describe('/recipes/:id (DELETE)', () => {
    let recipeId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Recipe to Delete',
          preparationMethod: 'Method',
        });

      recipeId = response.body.id;
    });

    it('should soft delete recipe', async () => {
      await request(app.getHttpServer())
        .delete(`/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      // Verify recipe is not returned in listing
      const listResponse = await request(app.getHttpServer())
        .get('/recipes')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ id: recipeId });

      expect(listResponse.body.data.length).toBe(0);
    });

    it('should return 404 for non-existent recipe', () => {
      return request(app.getHttpServer())
        .delete('/recipes/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
