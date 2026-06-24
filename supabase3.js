// ============================================================
//  profils.js — CRUD profils membres
//  Nour Al Zawwaj · v1.0
// ============================================================

import { supabase } from './supabase.js';

// ── CRÉER / METTRE À JOUR UN PROFIL ───────────────────────

/**
 * Upsert (insert ou update) d'un profil membre.
 * Le score de complétude est calculé côté Supabase par trigger.
 *
 * @param {string} utilisateurId  — UUID interne (table utilisateurs)
 * @param {Object} data           — Champs du profil
 * @returns {{ profil, error }}
 */
export async function sauvegarderProfil(utilisateurId, data) {
    const payload = {
        utilisateur_id:           utilisateurId,
        prenom:                   data.prenom,
        age:                      Number(data.age),
        pays:                     data.pays,
        ville:                    data.ville,
        nationalite:              data.nationalite       || null,
        profession:               data.profession,
        situation:                data.situation,
        nb_enfants:               Number(data.nb_enfants ?? 0),
        garde_enfants:            data.garde_enfants     || null,
        niveau_pratique:          data.niveau_pratique,
        ecole_juridique:          data.ecole_juridique   || null,
        pratiques:                data.pratiques         || [],
        port_voile:               data.port_voile        || null,
        role_foyer_souhaite:      data.role_foyer        || null,
        nb_enfants_souhaites:     data.nb_enfants_souhaites || null,
        description:              data.description,
        mots_cles:                data.mots_cles         || [],
        critere_age_min:          data.critere_age_min ? Number(data.critere_age_min) : null,
        critere_age_max:          data.critere_age_max ? Number(data.critere_age_max) : null,
        critere_pays:             data.critere_pays      || null,
        critere_niveau_pratique:  data.critere_niveau    || null,
        critere_situation:        data.critere_situation || null,
        criteres_coches:          data.criteres_coches   || [],
        criteres_libres:          data.criteres_libres   || null,
    };

    const { data: profil, error } = await supabase
        .from('profils')
        .upsert(payload, { onConflict: 'utilisateur_id' })
        .select()
        .single();

    return { profil, error };
}

// ── RÉCUPÉRER SON PROPRE PROFIL ────────────────────────────

/**
 * Récupère le profil complet du membre connecté.
 */
export async function monProfil(utilisateurId) {
    const { data, error } = await supabase
        .from('profils')
        .select('*')
        .eq('utilisateur_id', utilisateurId)
        .single();

    return { profil: data, error };
}

// ── RÉCUPÉRER LES PROFILS PUBLICS ─────────────────────────

/**
 * Liste les profils validés (via la vue v_profils_publics).
 * Supporte filtres et pagination.
 *
 * @param {Object} filtres
 * @param {string}  filtres.genre          — 'homme' | 'femme'
 * @param {number}  filtres.age_min
 * @param {number}  filtres.age_max
 * @param {string}  filtres.pays
 * @param {string}  filtres.niveau_pratique
 * @param {number}  filtres.page           — 0-indexed
 * @param {number}  filtres.limite         — par défaut 20
 * @returns {{ profils, count, error }}
 */
export async function listerProfils({
    genre,
    age_min,
    age_max,
    pays,
    niveau_pratique,
    page  = 0,
    limite = 20,
} = {}) {
    let query = supabase
        .from('v_profils_publics')
        .select('*', { count: 'exact' })
        .order('completude', { ascending: false })
        .range(page * limite, (page + 1) * limite - 1);

    if (genre)           query = query.eq('genre', genre);
    if (age_min)         query = query.gte('age', age_min);
    if (age_max)         query = query.lte('age', age_max);
    if (pays)            query = query.eq('pays', pays);
    if (niveau_pratique) query = query.eq('niveau_pratique', niveau_pratique);

    const { data, count, error } = await query;
    return { profils: data ?? [], count, error };
}

/**
 * Récupère un profil public par son utilisateur_id.
 */
export async function voirProfil(utilisateurId) {
    const { data, error } = await supabase
        .from('v_profils_publics')
        .select('*')
        .eq('utilisateur_id', utilisateurId)
        .single();

    return { profil: data, error };
}

/**
 * Recherche plein-texte dans les descriptions de profils.
 */
export async function rechercherProfils(terme, genre, limite = 20) {
    let query = supabase
        .from('v_profils_publics')
        .select('*')
        .textSearch('description', terme, { type: 'websearch', config: 'french' })
        .limit(limite);

    if (genre) query = query.eq('genre', genre);

    const { data, error } = await query;
    return { profils: data ?? [], error };
}

// ── UPLOAD PHOTO ───────────────────────────────────────────

/**
 * Upload une photo vers Supabase Storage et insère la référence en base.
 *
 * @param {string}  utilisateurId
 * @param {File}    file
 * @param {boolean} estPrincipale
 * @returns {{ photo, error }}
 */
export async function uploadPhoto(utilisateurId, file, estPrincipale = false) {
    // Validation côté client
    const MAX_SIZE  = 5 * 1024 * 1024; // 5 Mo
    const TYPES_OK  = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_SIZE)          return { photo: null, error: { message: 'La photo dépasse 5 Mo.' } };
    if (!TYPES_OK.includes(file.type)) return { photo: null, error: { message: 'Format non supporté (JPG, PNG, WEBP).' } };

    const ext  = file.name.split('.').pop().toLowerCase();
    const path = `photos/${utilisateurId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload dans Supabase Storage (bucket "photos")
    const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) return { photo: null, error: uploadError };

    // URL publique (bucket privé → URL signée 1 an)
    const { data: { signedUrl } } = await supabase.storage
        .from('photos')
        .createSignedUrl(path, 60 * 60 * 24 * 365);

    // Si principale : démissionner l'ancienne photo principale
    if (estPrincipale) {
        await supabase
            .from('photos')
            .update({ est_principale: false })
            .eq('utilisateur_id', utilisateurId)
            .eq('est_principale', true);
    }

    // Insérer la référence en base
    const { data: photo, error: insertError } = await supabase
        .from('photos')
        .insert({
            utilisateur_id:  utilisateurId,
            storage_path:    path,
            url_publique:    signedUrl,
            est_principale:  estPrincipale,
            taille_octets:   file.size,
            format:          ext,
        })
        .select()
        .single();

    return { photo, error: insertError };
}

/**
 * Récupère toutes les photos d'un membre.
 */
export async function mesPhotos(utilisateurId) {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('utilisateur_id', utilisateurId)
        .order('ordre', { ascending: true });

    return { photos: data ?? [], error };
}
