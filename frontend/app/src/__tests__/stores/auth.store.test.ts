jest.mock('../../services/auth.service', () => ({
  authService: {
    me: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getStoredUserId: jest.fn(),
  },
}));

import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../services/auth.service';

const mockUser = { id: 'u-1', login: 'john', name: 'John' };

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({
    user: null,
    isLoading: false,
    isInitializing: true,
    error: null,
  });
});

describe('initialize', () => {
  it('sets user when session is active', async () => {
    (authService.me as jest.Mock).mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().initialize();

    const { user, isInitializing } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isInitializing).toBe(false);
  });

  it('sets user to null when session is absent', async () => {
    (authService.me as jest.Mock).mockRejectedValueOnce(new Error('Não autenticado.'));

    await useAuthStore.getState().initialize();

    const { user, isInitializing } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isInitializing).toBe(false);
  });
});

describe('login', () => {
  it('sets user on success', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().login({ login: 'john', password: 'secret' });

    const { user, isLoading, error } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('sets error and clears loading on failure', async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Login ou senha inválidos.'));

    await useAuthStore.getState().login({ login: 'john', password: 'wrong' });

    const { user, isLoading, error } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isLoading).toBe(false);
    expect(error).toBe('Login ou senha inválidos.');
  });
});

describe('register', () => {
  it('clears loading on success', async () => {
    (authService.register as jest.Mock).mockResolvedValueOnce(undefined);

    await useAuthStore.getState().register({ login: 'john', password: 'secret' });

    const { isLoading, error } = useAuthStore.getState();
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('sets error on failure', async () => {
    (authService.register as jest.Mock).mockRejectedValueOnce(
      new Error('Este login já está em uso.'),
    );

    await useAuthStore.getState().register({ login: 'john', password: 'secret' });

    const { error } = useAuthStore.getState();
    expect(error).toBe('Este login já está em uso.');
  });
});

describe('logout', () => {
  it('clears user state', async () => {
    useAuthStore.setState({ user: mockUser });
    (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
  });

  it('clears user even if logout service throws', async () => {
    useAuthStore.setState({ user: mockUser });
    (authService.logout as jest.Mock).mockRejectedValueOnce(new Error('network'));

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('clearError', () => {
  it('resets error to null', () => {
    useAuthStore.setState({ error: 'some error' });

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });
});
