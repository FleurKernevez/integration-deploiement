/**
 * Récupère la liste des posts de blog depuis le backend Node.js.
 *
 * @async
 * @function
 * @returns {Promise<Object>} Un objet contenant la liste des posts.
 * @throws {Error} En cas d'erreur réseau ou HTTP.
 */
export async function fetchPosts() {
  try {
    const response = await fetch(`${process.env.REACT_APP_MONGOURL}/posts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la récupération des posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur dans fetchPosts:', error);
    throw error;
  }
} 