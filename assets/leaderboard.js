/*
  Aide partagée pour la connexion optionnelle et les classements de scores.
  Utilise Supabase (auth + base de données), sans framework ni build.

  À inclure dans cet ordre, dans un jeu (ex. games/ton-nom/mon-jeu.html) :
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js" integrity="sha384-qafw21c/iciq0VXsi9FzkfoQv5I/V0iqE4lSNcKXPnW9/UTJLnv5CcN4FHxVLnKg" crossorigin="anonymous"></script>
    <script src="../../assets/supabase-config.js"></script>
    <script src="../../assets/leaderboard.js"></script>

  Expose ensuite window.Leaderboard avec :
  - getCurrentUser() -> Promise<user|null>
  - onAuthChange(callback)
  - signInWithEmail(email) -> Promise<{success, message?}> (envoie un lien magique)
  - signOut() -> Promise
  - submitScore(gameSlug, playerName, score) -> Promise<boolean>
  - getTopScores(gameSlug, limit) -> Promise<Array<{player_name, score}>>
    Sans limit, renvoie tout le classement (un joueur = son meilleur score) ;
    prévu pour être affiché dans une liste défilante, pas juste un "top 5".

  Si SUPABASE_URL / SUPABASE_ANON_KEY sont encore des placeholders (projet non
  configuré), les appels réseau échouent proprement : le jeu reste jouable,
  seul le classement est indisponible (erreur silencieuse en console).
*/
(function (global) {
  let client = null;

  function getClient() {
    if (!client) {
      client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return client;
  }

  async function getCurrentUser() {
    try {
      const { data } = await getClient().auth.getSession();
      return data.session ? data.session.user : null;
    } catch (err) {
      console.warn('Leaderboard: session indisponible.', err.message);
      return null;
    }
  }

  function onAuthChange(callback) {
    getClient().auth.onAuthStateChange((_event, session) => {
      callback(session ? session.user : null);
    });
  }

  async function signInWithEmail(email) {
    try {
      const { error } = await getClient().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href }
      });

      if (error) {
        console.warn('Leaderboard: connexion impossible.', error.message);
        const message = /rate limit/i.test(error.message)
          ? 'Trop de tentatives de connexion pour le moment, réessaie dans quelques minutes.'
          : "La connexion n'a pas fonctionné, réessaie plus tard.";
        return { success: false, message };
      }
      return { success: true };
    } catch (err) {
      console.warn('Leaderboard: connexion impossible (réseau/config).', err.message);
      return { success: false, message: "La connexion n'a pas fonctionné, réessaie plus tard." };
    }
  }

  function signOut() {
    return getClient().auth.signOut();
  }

  async function submitScore(gameSlug, playerName, score) {
    try {
      const user = await getCurrentUser();
      const { error } = await getClient()
        .from('scores')
        .insert({
          game_slug: gameSlug,
          player_name: (playerName || 'Anonyme').slice(0, 40),
          score: Math.round(score),
          user_id: user ? user.id : null
        });

      if (error) {
        console.warn('Leaderboard: score non enregistré.', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Leaderboard: score non enregistré (réseau/config).', err.message);
      return false;
    }
  }

  async function getTopScores(gameSlug, limit) {
    try {
      const { data, error } = await getClient()
        .from('scores')
        .select('player_name, score, user_id')
        .eq('game_slug', gameSlug)
        .order('score', { ascending: false })
        .limit(1000);

      if (error) {
        console.warn('Leaderboard: classement indisponible.', error.message);
        return [];
      }

      // Ne garde que le meilleur score par joueur (compte si connecté, sinon pseudo).
      const seen = new Set();
      const best = [];
      for (const row of data) {
        const key = row.user_id || row.player_name;
        if (seen.has(key)) continue;
        seen.add(key);
        best.push(row);
        if (limit && best.length >= limit) break;
      }
      return best;
    } catch (err) {
      console.warn('Leaderboard: classement indisponible (réseau/config).', err.message);
      return [];
    }
  }

  global.Leaderboard = {
    getCurrentUser,
    onAuthChange,
    signInWithEmail,
    signOut,
    submitScore,
    getTopScores
  };
})(window);
