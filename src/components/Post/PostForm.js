import React, { useState } from 'react';

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Appel API pour créer le post (à adapter selon backend)
    await fetch(`${process.env.REACT_APP_MONGOURL}/posts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    });
    setTitle('');
    setContent('');
    setAuthor('');
    if (onPostCreated) onPostCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>Créer un nouveau post</h3>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Auteur"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        required
      />
      <button type="submit">Publier</button>
    </form>
  );
};

export default PostForm; 