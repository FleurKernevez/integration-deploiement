import React, { useEffect, useState } from 'react';
import './ListComponent.css';

const ListComponent = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [usersCount, setUsersCount] = useState([]);
  const isAdmin = !!localStorage.getItem('adminToken');


  useEffect(() => {
    const getUsers = async () => {
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`)
      const data = await fetchData.json();
      const response = data.utilisateurs;
      setUsersCount(response.length);

      const formattedUsers = response.map(userArray => ({
        id: userArray[0],
        lastName: userArray[1],
        firstName: userArray[2],
        email: userArray[3],
        dateOfBirth: userArray[4],
        postalCode: userArray[5],
        city: userArray[6],
    }));

      setUsersCount(formattedUsers.length);
      setRegisteredUsers(formattedUsers)
    }
    getUsers();

    const handleUserAdded = () => {
      getUsers();
    };

    window.addEventListener('userAdded', handleUserAdded);

    return () => {
      window.removeEventListener('userAdded', handleUserAdded);
    };
  }
  , []);

  const handleDeleteUser = async (userId, userName) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("Vous devez être connecté en tant qu'administrateur.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Utilisateur supprimé avec succès !');
        // Refresh ou remove from state
        window.dispatchEvent(new Event("userAdded")); // ou re-fetch users
      } else {
        alert("Erreur lors de la suppression de l’utilisateur.");
      }
    } catch (error) {
      console.error("Erreur delete :", error);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  return (
    <div className="registered-list">
      <h2 className="registered-list-title">Nombre d'inscrits</h2>
      <p> {usersCount} user(s) already registered</p>
      <h2 className="registered-list-title">Liste des inscrits</h2>
      <ul className="list-none p-0">
        {registeredUsers.length > 0 ? (
          registeredUsers.map((user, index) => (
            <li key={user.id} className="registered-item" data-testid={`user-${user.id}`}>
              <div className="registered-item-text">
                {`${user.firstName} ${user.lastName} - ${user.email}`}
              </div>
              <div className="registered-item-text">
                {`Né(e) le ${user.dateOfBirth} - ${user.city} (${user.postalCode})`}
              </div>
              <div className="registered-item-text">
                {`id: ${user.id}`}
              </div>
              {isAdmin && (
                <button
                  data-testid={`delete-${user.id}`}
                  className="registered-item-text"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  {`Supprimer ${user.firstName} ${user.lastName}`}
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="registered-item">
            <div className="registered-item-text">Aucun utilisateur enregistré.</div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ListComponent;