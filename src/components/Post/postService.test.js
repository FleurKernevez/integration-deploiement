import { fetchPosts } from './postService';

describe('fetchPosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('récupère les posts avec succès', async () => {
    const mockData = { posts: [{ _id: '1', title: 'T', content: 'C', author: 'A' }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const data = await fetchPosts();
    expect(data).toEqual(mockData);
  });

  it('gère une erreur HTTP', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur' }),
    });
    await expect(fetchPosts()).rejects.toThrow('Erreur');
  });

  it('gère une erreur réseau', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchPosts()).rejects.toThrow('Network error');
  });

  it('gère une erreur lors du parsing JSON après une réponse non-OK', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    await expect(fetchPosts()).rejects.toThrow('Erreur lors de la récupération des posts');
  });
});
