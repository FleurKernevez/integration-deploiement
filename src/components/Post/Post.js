import React, { useEffect, useState } from 'react';
import './Post.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostForm from './PostForm';
import { fetchPosts } from './postService';

/**
 * Page pour afficher et créer des posts de blog.
 *
 * @component
 */
const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Récupère les posts depuis le backend.
   */
  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data.posts || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return <p>Chargement des posts...</p>;
  }

  return (
    <div className="post-page">
      <PostForm onPostCreated={loadPosts} />

      <h2>Liste des Posts de Blog</h2>
      {posts.length > 0 ? posts.map((post) => (
        <div key={post._id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>Par {post.author}</small>
        </div>
      )) : <p>Aucun post à afficher.</p>}

      <ToastContainer />
    </div>
  );
};

export default Post; 