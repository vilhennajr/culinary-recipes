import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;
  let userId: string;
  const timestamp = Date.now();
  const testLogin = `test-user-${timestamp}@example.com`;

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

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ login: testLogin, password: 'password123', name: 'Carlos Souza' });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: testLogin, password: 'password123' });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: { login: { contains: `test-user-${timestamp}` } },
    });
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return a paginated list of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          const me = res.body.data.find((u: any) => u.id === userId);
          expect(me).toBeDefined();
          expect(me).not.toHaveProperty('password');
          expect(res.body.meta).toMatchObject({
            page: 1,
            limit: 10,
          });
        });
    });

    it('should filter users by name', () => {
      return request(app.getHttpServer())
        .get('/users?name=Carlos')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('login', testLogin);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update user name', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Ana Lima' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Ana Lima');
          expect(res.body.id).toBe(userId);
        });
    });

    it('should update user password', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'newpassword123' })
        .expect(200);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: testLogin, password: 'newpassword123' })
        .expect(200);

      accessToken = loginResponse.body.accessToken;
    });

    it('should return 400 with short password', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: '123' })
        .expect(400);
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ name: 'No Auth' })
        .expect(401);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer()).delete(`/users/${userId}`).expect(401);
    });

    it('should delete a user by ID', async () => {
      const deleteLogin = `test-user-del-${timestamp}@example.com`;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ login: deleteLogin, password: 'password123', name: 'Rodrigo Mendes' });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: deleteLogin, password: 'password123' });

      const deleteId = (await prismaService.user.findUnique({ where: { login: deleteLogin } }))!.id;

      await request(app.getHttpServer())
        .delete(`/users/${deleteId}`)
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .expect(204);

      const user = await prismaService.user.findUnique({ where: { login: deleteLogin } });
      expect(user).not.toBeNull();
      expect(user!.deletedAt).not.toBeNull();
    });
  });
});
