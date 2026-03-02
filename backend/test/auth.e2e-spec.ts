import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  const timestamp = Date.now();
  const testUser = {
    login: `test-${timestamp}@example.com`,
    password: 'password123',
    name: 'Pedro Alves',
  };

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
  });

  afterAll(async () => {
    // Clean only test data created by this suite
    await prismaService.user.deleteMany({
      where: { login: { contains: `test-${timestamp}` } },
    });
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.login).toBe(testUser.login);
          expect(res.body.name).toBe(testUser.name);
        });
    });

    it('should fail with duplicate login', () => {
      return request(app.getHttpServer()).post('/auth/register').send(testUser).expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser.login,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body.user.login).toBe(testUser.login);
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser.login,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout successfully and revoke token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: testUser.login, password: testUser.password });

      const token = loginResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).post('/auth/logout').expect(401);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return current user profile', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: testUser.login, password: testUser.password });

      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.login).toBe(testUser.login);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });
});
