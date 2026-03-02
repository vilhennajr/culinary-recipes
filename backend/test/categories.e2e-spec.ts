import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;
  let userId: string;
  const timestamp = Date.now();
  const testLogin = `test-category-${timestamp}@example.com`;

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
      name: 'Fernanda Costa',
    });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      login: testLogin,
      password: 'password123',
    });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    // Clean only test data created by this suite
    await prismaService.category.deleteMany({
      where: { name: { contains: `${timestamp}` } },
    });
    await prismaService.user.deleteMany({ where: { id: userId } });
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/categories (POST)', () => {
    it('should create a category', () => {
      const uniqueName = `Desserts ${Date.now()}`;
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: uniqueName })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(uniqueName);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail with duplicate name', async () => {
      const uniqueName = `Unique ${Date.now()}`;

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: uniqueName });

      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: uniqueName })
        .expect(409);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).post('/categories').send({ name: 'Test' }).expect(401);
    });

    it('should fail without name', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it('should fail with empty name', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should fail with name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: longName })
        .expect(400);
    });
  });

  describe('/categories (GET)', () => {
    beforeAll(async () => {
      // Create some test categories
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `E2E Test Category 1 ${Date.now()}` });

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `E2E Test Category 2 ${Date.now()}` });
    });

    it('should list categories with pagination', () => {
      return request(app.getHttpServer())
        .get('/categories')
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
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should filter categories by name', async () => {
      const uniqueName = `Searchable ${Date.now()}`;
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: uniqueName });

      return request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ name: uniqueName })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.data[0].name).toBe(uniqueName);
        });
    });

    it('should return empty results for non-matching filter', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ name: 'NonExistentCategory12345' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get('/categories').expect(401);
    });
  });

  describe('/categories/:id (GET)', () => {
    let categoryId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `Get By ID ${Date.now()}` });

      categoryId = response.body.id;
    });

    it('should get category by id', () => {
      return request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(categoryId);
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .get('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/categories/invalid-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('/categories/:id (PUT)', () => {
    let categoryId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `Original ${Date.now()}` });

      categoryId = response.body.id;
    });

    it('should update category', () => {
      const newName = `Updated ${Date.now()}`;
      return request(app.getHttpServer())
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: newName })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(newName);
          expect(res.body.id).toBe(categoryId);
        });
    });

    it('should fail with duplicate name', async () => {
      const existingName = `Existing ${Date.now()}`;
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: existingName });

      return request(app.getHttpServer())
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: existingName })
        .expect(409);
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .put('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' })
        .expect(404);
    });

    it('should fail without name', () => {
      return request(app.getHttpServer())
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('/categories/:id (DELETE)', () => {
    let categoryId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: `To Delete ${Date.now()}` });

      categoryId = response.body.id;
    });

    it('should soft delete category', async () => {
      await request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      // Verify category is not returned in listing
      const listResponse = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ id: categoryId });

      expect(listResponse.body.data.length).toBe(0);
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .delete('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).delete(`/categories/${categoryId}`).expect(401);
    });
  });
});
