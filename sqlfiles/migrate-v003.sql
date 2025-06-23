USE ynov_ci;
SELECT * FROM utilisateur;
INSERT INTO utilisateur (nom, prenom, email, dateDeNaissance, codePostal, ville) VALUES ('Dupont', 'Jean', 'jean.dupont@example.com', '1980-01-01', '75001', 'Paris');
SELECT * FROM utilisateur;