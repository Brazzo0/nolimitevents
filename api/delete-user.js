const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, adminKey } = req.body;
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    if (!userId) return res.status(400).json({ error: 'userId requis' });

    const supabaseAdmin = createClient(
      'https://eypfrylitsaplkqpyxsh.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Broadcast le signal d'éjection AVANT de supprimer (token encore valide)
    const kickChannel = supabaseAdmin.channel(`kick:${userId}`);
    await kickChannel.send({ type: 'broadcast', event: 'kicked', payload: { userId } });
    await supabaseAdmin.removeChannel(kickChannel);

    // 2. Récupérer l'email pour supprimer les billets
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    const userEmail = userData?.user?.email;

    // 3. Supprimer le profil via fonction SQL (contourne RLS)
    const { error: rpcErr } = await supabaseAdmin.rpc('admin_delete_profile', { target_id: userId });
    if (rpcErr) console.error('rpc error:', rpcErr.message);

    // 4. Supprimer le compte Auth définitivement
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
