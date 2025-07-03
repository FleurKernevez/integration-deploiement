import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Post from './Post';
import * as postService from './postService';
import userEvent from '@testing-library/user-event';

jest.mock('react-toastify/dist/ReactToastify.css', () => {});

jest.mock('./postService');

jest.mock('./PostForm', () => (props) => (
  <button data-testid="mock-postform" onClick={props.onPostCreated}>
    Mock PostForm
  </button>
));

describe('Post component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche un message de chargement pendant la récupération', async () => {
    postService.fetchPosts.mockResolvedValueOnce({ posts: [] });

    render(<Post />);
    expect(screen.getByText(/chargement des posts/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(postService.fetchPosts).toHaveBeenCalled();
    });
  });

  test('Affiche les posts récupérés', async () => {
    const mockPosts = [
      { _id: '1', title: 'Post 1', content: 'Content 1', author: 'Author 1' },
      { _id: '2', title: 'Post 2', content: 'Content 2', author: 'Author 2' }
    ];

    postService.fetchPosts.mockResolvedValueOnce({ posts: mockPosts });

    render(<Post />);

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  test('Affiche un message si aucun post n\'est présent', async () => {
    postService.fetchPosts.mockResolvedValueOnce({ posts: [] });

    render(<Post />);

    await waitFor(() => {
      expect(screen.getByText(/aucun post à afficher/i)).toBeInTheDocument();
    });
  });

  test('Gère les erreurs de récupération en affichant un message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    postService.fetchPosts.mockRejectedValueOnce(new Error('Erreur API'));

    render(<Post />);

    await waitFor(() => {
      expect(screen.getByText(/erreur lors du chargement des posts/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('Recharge les posts après création via PostForm', async () => {
    postService.fetchPosts.mockResolvedValue({ posts: [] });

    render(<Post />);

    await waitFor(() => {
      expect(postService.fetchPosts).toHaveBeenCalledTimes(1);
    });

    const button = screen.getByTestId('mock-postform');
    await userEvent.click(button);

    await waitFor(() => {
      expect(postService.fetchPosts).toHaveBeenCalledTimes(2);
    });
  });
});
