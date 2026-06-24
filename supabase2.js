// ============================================================
//  auth.js — Inscription, connexion, déconnexion
//  Nour Al Zawwaj · v1.0
// ============================================================

import { supabase } from './supabase.js';

// ── INSCRIPTION ────────────────────────────────────────────

/**
 * Crée un compte Auth + ligne utilisateurs en une transaction.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.genre        — 'homme' | 'femme'
 * @param {string} [params.waliEmail]  — optionnel
 * @param {string} [params.waliNom]
 * @param {string} [params.waliLien]
 * @returns {{ user, error }}
 */
export async function inscrire({ email, password, genre, waliEmail, waliNom, waliLien }) {
    // 1. Créer le compte Auth Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/connexion.html`,
            data: { genre }, // metadata visible dans auth.users
        },
    });

    if (authError) return { user: null, error: authError };

    const authUser = authData.user;

    // 2. Créer la ligne dans la table utilisateurs
    const { error: userError } = await supabase
        .from('utilisateurs')
        .insert({
            auth_id:      authUser.id,
            email,
            genre,
            wali_email:   waliEmail  || null,
            wali_nom:     waliNom    || null,
            wali_lien:    waliLien   || null,
            wali_notifie: !!waliEmail,
        });

    if (userError) {
        // Rollback Auth si insertion échoue (best-effort)
        await supabase.auth.admin?.deleteUser?.(authUser.id);
        return { user: null, error: userError };
    }

    return { user: authUser, error: null };
}

// ── CONNEXION ──────────────────────────────────────────────

/**
 * Connexion par email + mot de passe.
 *
 * @returns {{ session, error }}
 */
export async function connecter({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { session: null, error };

    // Mettre à jour derniere_connexion
    const userId = data.user?.id;
    if (userId) {
        // Récupère l'id interne depuis auth_id
        const { data: uRow } = await supabase
            .from('utilisateurs')
            .select('id')
            .eq('auth_id', userId)
            .single();

        if (uRow) {
            await supabase
                .from('utilisateurs')
                .update({ derniere_connexion: new Date().toISOString() })
                .eq('id', uRow.id);
        }
    }

    return { session: data.session, error: null };
}

// ── DÉCONNEXION ────────────────────────────────────────────

export async function deconnecter() {
    const { error } = await supabase.auth.signOut();
    if (!error) window.location.href = '/index.html';
    return { error };
}

// ── MOT DE PASSE OUBLIÉ ────────────────────────────────────

/**
 * Envoie un e-mail de réinitialisation.
 *
 * @returns {{ error }}
 */
export async function reinitialiserMotDePasse(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nouveau-mot-de-passe.html`,
    });
    return { error };
}

// ── NOUVEAU MOT DE PASSE ───────────────────────────────────

/**
 * À appeler sur la page nouveau-mot-de-passe.html après redirection.
 */
export async function mettreAJourMotDePasse(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
}

// ── ÉTAT D'AUTH EN TEMPS RÉEL ─────────────────────────────

/**
 * Abonnement aux changements d'état d'authentification.
 * callback(event, session) est appelé à chaque changement.
 */
export function onAuthChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
