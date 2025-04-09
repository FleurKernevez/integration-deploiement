import { validateName, validateEmail, validateDateOfBirth, validatePostalCode } from './CheckForm';

describe('Validation des champs du formulaire', () => {
  describe('validateDateOfBirth (âge)', () => {
    it("doit refuser si l'utilisateur a moins de 18 ans", () => {
      const minorDate = new Date();
      minorDate.setFullYear(minorDate.getFullYear() - 17);
      expect(validateDateOfBirth(minorDate.toISOString().split('T')[0])).toBe(false);
    });

    it("doit accepter si l'utilisateur a exactement 18 ans", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      expect(validateDateOfBirth(date.toISOString().split('T')[0])).toBe(true);
    });

    it("doit accepter si l'utilisateur a plus de 18 ans", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 30);
      expect(validateDateOfBirth(date.toISOString().split('T')[0])).toBe(true);
    });

    it('doit refuser un format de date invalide', () => {
      expect(validateDateOfBirth('not-a-date')).toBe(false);
    });
  });

  describe('validation du code postal', () => {
    it('doit accepter un code postal valide (5 chiffres)', () => {
      expect(validatePostalCode('75001')).toBe(true);
    });

    it('doit refuser un code postal de 4 chiffres', () => {
      expect(validatePostalCode('1234')).toBe(false);
    });

    it('doit refuser un code postal avec des lettres', () => {
      expect(validatePostalCode('75A01')).toBe(false);
    });
  });

  describe('validation du nom', () => {
    it('doit accepter un nom simple', () => {
      expect(validateName('Dupont')).toBe(true);
    });

    it('doit accepter un nom avec tiret', () => {
      expect(validateName('Jean-Pierre')).toBe(true);
    });

    it('doit accepter un nom avec accents', () => {
      expect(validateName('Éléonore')).toBe(true);
    });

    it('doit accepter un nom avec tréma', () => {
      expect(validateName('Noël-Aïcha')).toBe(true);
    });

    it("doit refuser un nom avec chiffre", () => {
      expect(validateName('Jean123')).toBe(false);
    });

    it("doit refuser un nom avec caractères spéciaux", () => {
      expect(validateName('Jean@Pierre')).toBe(false);
    });

    it("doit refuser un nom vide", () => {
      expect(validateName('')).toBe(false);
    });
  });

  describe("validation de l'email", () => {
    it('doit accepter un email valide', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('doit refuser un email sans @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    it('doit refuser un email sans domaine', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('doit refuser un email avec des espaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });
});



