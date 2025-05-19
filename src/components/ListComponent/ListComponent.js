import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListComponent.css';

const ListComponent = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [usersCount, setUsersCount] = useState([]);

/*   const loadUsers = () => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setRegisteredUsers(JSON.parse(storedData));
    } else {
      setRegisteredUsers([]);
    }
  }; */
/* 
  const loadUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users`);
      if (response.status === 200) {
        setRegisteredUsers(response.data);
      } else {
        setRegisteredUsers([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setRegisteredUsers([]);
    }
  }; */

  useEffect(() => {
/*     loadUsers();

    const handleUserAdded = () => {
      loadUsers();
    }; */
/* 
    window.addEventListener('userAdded', handleUserAdded);

    return () => {
      window.removeEventListener('userAdded', handleUserAdded);
    }; */
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      console.log(process.env);
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`)
      const data = await fetchData.json();
      const response = data.utilisateurs;
      console.log('response', response);
      console.log('response.length', response.length);
      setUsersCount(response.length);
    }
    getUsers();
  }
  , []);

  return (
    <div className="registered-list">
      <h2 className="registered-list-title">Nombre d'inscrits</h2>
      <p> {usersCount} user(s) already registered</p>
      <h2 className="registered-list-title">Liste des inscrits</h2>
      <ul className="list-none p-0">
        {registeredUsers.length > 0 ? (
          registeredUsers.map((user, index) => (
            <li key={index} className="registered-item">
              <div className="registered-item-text">
                {`${user.firstName} ${user.lastName} - ${user.email}`}
              </div>
              <div className="registered-item-text">
                {`Né(e) le ${user.dateOfBirth} - ${user.city} (${user.postalCode})`}
              </div>
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