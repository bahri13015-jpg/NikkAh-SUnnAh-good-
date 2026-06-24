// ============================================================
//  supabase.js — Client Supabase centralisé
//  Nour Al Zawwaj · v1.0
//
//  ⚠️  CONFIGURATION REQUISE :
//  Remplacer les deux constantes ci-dessous par vos vraies
//  clés disponibles dans :
//  Supabase Dashboard → Settings → API
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://hozxklpzfzmrswzbamye.supabase.co';
const SUPABASE_ANON = 'sb_publishable_MurlKY4clW48vcHYcuXCMw_WrbuhDIA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
        persistSession:     true,
        autoRefreshToken:   true,
        detectSessionInUrl: true,
        storageKey:         'nour_al_zawwaj_session',
    },
});

// ── Helpers d'authentification ─────────────────────────────

/**
 * Retourne l'utilisateur actuellement connecté (null si déconnecté).
 */
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Retourne le profil complet du membre connecté.
 */
export async function getProfil(userId) {
    const { data, error } = await supabase
        .from('profils')
        .select(`
            *,
            utilisateurs ( genre, identite_verifiee, compte_actif )
        `)
        .eq('utilisateur_id', userId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Redirige vers connexion.html si l'utilisateur n'est pas connecté.
 * À appeler en haut de chaque page protégée.
 */
export async function requireAuth(redirectTo = '/connexion.html') {
    const user = await getUser();
    if (!user) {
        window.location.href = redirectTo;
        return null;
    }
    return user;
}

/**
 * Redirige vers dashboard.html si l'utilisateur EST déjà connecté.
 * À appeler sur connexion.html et inscription.html.
 */
export async function redirectIfAuth(redirectTo = '/dashboard.html') {
    const user = await getUser();
    if (user) {
        window.location.href = redirectTo;
    }
}
