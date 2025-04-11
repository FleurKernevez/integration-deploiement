import React, { useEffect, useState } from 'react';
import './ListComponent.css';

const ListComponent = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const loadUsers = () => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setRegisteredUsers(JSON.parse(storedData));
    } else {
      setRegisteredUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();

    const handleUserAdded = () => {
      loadUsers();
    };

    window.addEventListener('userAdded', handleUserAdded);

    return () => {
      window.removeEventListener('userAdded', handleUserAdded);
    };
  }, []);

  return (
    <div className="registered-list">
      <h2 className="registered-list-title">Liste des Inscrits</h2>
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