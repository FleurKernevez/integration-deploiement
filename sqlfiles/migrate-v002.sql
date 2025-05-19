USE ynov_ci;
CREATE TABLE utilisateur (
  id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nom varchar(255),
  prenom varchar(255),
  email varchar(255),
  dateDeNaissance date,
  codePostal varchar(5),
  ville varchar(255)
);
DESCRIBE utilisateur;