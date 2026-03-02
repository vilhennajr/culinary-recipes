import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  describe('check', () => {
    it('should return health status', () => {
      const result = controller.check();

      expect(result).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });

    it('should include environment', () => {
      const result = controller.check();

      expect(result.environment).toBeDefined();
    });
  });
});
