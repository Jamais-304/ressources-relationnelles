// Import de l'objet body depuis express-validator
import { body } from "express-validator"
// Règles de validation pour l'inscription de l'utilisateur
export const signUpUserValidationRules = [
    // L'email : eamil, obligatoire, échapper les caractères spéciaux
    body("email")
        .isEmail()
        .withMessage("L'email doit être une adresse email valide")
        .normalizeEmail() // Normaliser l'email
        .escape()
        .trim(), // Enlever les espaces en début et fin de chaîne
    // Le mot de passe : chaîne de caractères , obligatoire, échapper les caractères spéciaux
    body("password")
        .isString()
        .isLength({ min: 8, max: 25 })
        .withMessage("Le mot de passe doit contenir au moins 8 caractère et faire moins de 26 caractères")
        .escape()
        .trim(), // Enlever les espaces en début et fin de chaîne
    // Le mot de passe : chaîne de caractères , obligatoire, échapper les caractères spéciaux
    body("pseudonyme")
        .isString()
        .isLength({ min: 5, max: 40 })
        .withMessage("Le pseudonyme doit contenir au moins 5 caractère et faire moins de 40 caractères")
        .escape()
        .trim() // Enlever les espaces en début et fin de chaîne
]

// Règles de validation pour la connexion de l'utilisateur
export const loginUserValidationRules = [
    // L'email : eamil, obligatoire, échapper les caractères spéciaux
    body("email")
        .isEmail()
        .withMessage("L'email doit être une adresse email valide")
        .normalizeEmail() // Normaliser l'email
        .escape()
        .trim(), // Enlever les espaces en début et fin de chaîne
    // Le mot de passe : chaîne de caractères , obligatoire, échapper les caractères spéciaux
    body("password")
        .isString()
        .isLength({ min: 8, max: 25 })
        .withMessage("Le mot de passe doit contenir au moins 8 caractère et faire moins de 26 caractères")
        .escape()
        .trim()
]
// Règles pour le refreshtoken
export const refreshTokenValidationRule = [
    body("refreshToken")
        .isString()
        .withMessage("Le refresh token doit être une chaîne de caractères")
        .escape()
        .trim() // Enlever les espaces en début et fin de chaîne
]

