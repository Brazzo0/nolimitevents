const { Resend } = require('resend');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, name, eventTitle, eventDate, eventLocation, ticketId } = req.body;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}&bgcolor=0D1117&color=FF0080&margin=10`;
    const walletUrl = `https://app.nolimitevents.ch/api/generate-pass?ticketId=${encodeURIComponent(ticketId)}&eventTitle=${encodeURIComponent(eventTitle)}&eventDate=${encodeURIComponent(eventDate)}&eventLocation=${encodeURIComponent(eventLocation)}&name=${encodeURIComponent(name||'')}`;
    const prenom = (name || '').split(' ')[0] || name || 'No Limiter';
    const isFree = ticketId.includes('FREE');

    await resend.emails.send({
      from: 'No Limit Events <info@nolimitevents.ch>',
      to: ['info@nolimitevents.ch', 'alexandre.11ferreira@icloud.com'],
      subject: `💰 Nouveau billet vendu – ${eventTitle}`,
      html: `<div style="font-family:sans-serif;background:#0D1117;color:#fff;padding:32px;border-radius:16px;max-width:480px;margin:0 auto;">
        <h2 style="color:#FF0080;margin:0 0 20px;">🎟️ Nouveau billet vendu !</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:rgba(255,255,255,.5);padding:8px 0;font-size:13px;">Événement</td><td style="color:#fff;font-weight:700;font-size:13px;">${eventTitle}</td></tr>
          <tr><td style="color:rgba(255,255,255,.5);padding:8px 0;font-size:13px;">Date</td><td style="color:#fff;font-weight:700;font-size:13px;">${eventDate}</td></tr>
          <tr><td style="color:rgba(255,255,255,.5);padding:8px 0;font-size:13px;">Acheteur</td><td style="color:#fff;font-weight:700;font-size:13px;">${name}</td></tr>
          <tr><td style="color:rgba(255,255,255,.5);padding:8px 0;font-size:13px;">Email</td><td style="color:#FF0080;font-weight:700;font-size:13px;">${email}</td></tr>
          <tr><td style="color:rgba(255,255,255,.5);padding:8px 0;font-size:13px;">ID Billet</td><td style="color:#fff;font-family:monospace;font-size:12px;">${ticketId}</td></tr>
        </table>
      </div>`
    });

    await resend.emails.send({
      from: 'No Limit Events <info@nolimitevents.ch>',
      to: email,
      subject: `🎟️ Ton billet – ${eventTitle}`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ton Billet – ${eventTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  @keyframes pulse {
    0%,100%{box-shadow:0 0 0 0 rgba(255,0,128,.5);}
    50%{box-shadow:0 0 0 12px rgba(255,0,128,0);}
  }
  @keyframes shimmer {
    0%{background-position:200% center;}
    100%{background-position:-200% center;}
  }
  @keyframes fadeIn {
    from{opacity:0;transform:translateY(16px);}
    to{opacity:1;transform:translateY(0);}
  }
  .ticket-wrap{animation:fadeIn .8s ease both;}
  .qr-glow{animation:pulse 2.5s ease-in-out infinite;}
  .hero-title{
    background:linear-gradient(90deg,#FF0080,#FF66B3,#FF0080);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 3s linear infinite;
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#080C12;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">

<div style="padding:32px 16px;min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(255,0,128,.12) 0%,#080C12 60%);">
<div class="ticket-wrap" style="max-width:420px;margin:0 auto;">

  <!-- Header brand -->
  <div style="text-align:center;margin-bottom:28px;">
    <img src="https://app.nolimitevents.ch/logo512.png" alt="No Limit Events" width="110" height="110" style="display:block;margin:0 auto 16px;border-radius:28px;box-shadow:0 0 40px rgba(255,0,128,.35),0 8px 24px rgba(0,0,0,.5);"/>
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,.3);letter-spacing:1.5px;text-transform:uppercase;">La soirée sans limites</p>
  </div>

  <!-- Main ticket card -->
  <div style="background:linear-gradient(160deg,#141A22 0%,#0D1117 100%);border-radius:24px;overflow:hidden;border:1px solid rgba(255,0,128,.2);box-shadow:0 24px 64px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.04);">

    <!-- Hero top -->
    <div style="background:linear-gradient(135deg,#FF0080 0%,#B3005B 50%,#7B2FFF 100%);padding:32px 24px 28px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.07);"></div>
      <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;border-radius:50%;background:rgba(0,0,0,.15);"></div>
      ${isFree ? `<div style="display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);border-radius:20px;padding:4px 14px;font-size:10px;font-weight:900;color:#fff;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;backdrop-filter:blur(8px);">BILLET GRATUIT</div>` : ''}
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Accès confirmé</div>
      <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;line-height:1.2;letter-spacing:-.3px;">${eventTitle}</h1>
    </div>

    <!-- Divider perforé -->
    <div style="position:relative;height:24px;background:#0D1117;">
      <div style="position:absolute;left:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:#080C12;"></div>
      <div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:#080C12;"></div>
      <div style="border-top:2px dashed rgba(255,0,128,.25);position:absolute;top:50%;left:20px;right:20px;transform:translateY(-50%);"></div>
    </div>

    <!-- Infos billet -->
    <div style="padding:24px 24px 0;">

      <!-- Salutation -->
      <div style="margin-bottom:22px;">
        <p style="margin:0;font-size:16px;font-weight:700;color:#fff;">Hey ${prenom} 👋</p>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.45);line-height:1.5;">Ton billet est confirmé. Présente ce QR code à l'entrée.</p>
      </div>

      <!-- Date + Lieu -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
        <tr>
          <td style="width:50%;padding:0 8px 0 0;vertical-align:top;">
            <div style="background:rgba(255,0,128,.07);border:1px solid rgba(255,0,128,.2);border-radius:14px;padding:14px 16px;">
              <div style="font-size:10px;font-weight:700;color:#FF0080;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">📅 Date</div>
              <div style="font-size:14px;font-weight:800;color:#fff;line-height:1.3;">${eventDate}</div>
            </div>
          </td>
          <td style="width:50%;padding:0 0 0 8px;vertical-align:top;">
            <div style="background:rgba(123,47,255,.07);border:1px solid rgba(123,47,255,.2);border-radius:14px;padding:14px 16px;">
              <div style="font-size:10px;font-weight:700;color:#9B6CF6;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">📍 Lieu</div>
              <div style="font-size:14px;font-weight:800;color:#fff;line-height:1.3;">${eventLocation}</div>
            </div>
          </td>
        </tr>
      </table>

      <!-- QR Code -->
      <div style="text-align:center;margin-bottom:22px;">
        <div class="qr-glow" style="display:inline-block;background:#0D1117;border-radius:20px;padding:16px;border:2px solid rgba(255,0,128,.4);box-shadow:0 0 32px rgba(255,0,128,.2);">
          <img src="${qrUrl}" alt="QR Code" width="180" height="180" style="display:block;border-radius:10px;"/>
        </div>
      </div>

      <!-- Ticket ID -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 16px;text-align:center;margin-bottom:16px;">
        <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.3);letter-spacing:2px;text-transform:uppercase;margin-bottom:5px;">ID du billet</div>
        <div style="font-family:'Courier New',monospace;font-size:15px;font-weight:700;color:#FF0080;letter-spacing:2px;">${ticketId}</div>
      </div>

      <!-- Apple Wallet -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="${walletUrl}" style="display:inline-block;background:#000;border:1.5px solid rgba(255,255,255,.25);border-radius:12px;padding:10px 22px;text-decoration:none;">
          <table style="border-collapse:collapse;display:inline-table;">
            <tr>
              <td style="vertical-align:middle;padding-right:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="14" rx="3" fill="white"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="white" stroke-width="1.5" fill="none"/>
                  <circle cx="8" cy="14" r="1.5" fill="#000"/>
                  <rect x="11" y="13" width="7" height="1.5" rx=".75" fill="#000"/>
                  <rect x="11" y="15.5" width="5" height="1.5" rx=".75" fill="#000"/>
                </svg>
              </td>
              <td style="vertical-align:middle;">
                <div style="font-size:9px;color:rgba(255,255,255,.5);font-weight:600;letter-spacing:1px;text-transform:uppercase;line-height:1;margin-bottom:2px;">Ajouter à</div>
                <div style="font-size:14px;color:#fff;font-weight:800;letter-spacing:.3px;line-height:1;">Apple Wallet</div>
              </td>
            </tr>
          </table>
        </a>
        <p style="margin:8px 0 0;font-size:10px;color:rgba(255,255,255,.2);">iPhone uniquement</p>
      </div>

    </div>

    <!-- Divider perforé bas -->
    <div style="position:relative;height:24px;background:#0D1117;margin-top:20px;">
      <div style="position:absolute;left:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:#080C12;"></div>
      <div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:#080C12;"></div>
      <div style="border-top:2px dashed rgba(255,255,255,.08);position:absolute;top:50%;left:20px;right:20px;transform:translateY(-50%);"></div>
    </div>

    <!-- Footer card -->
    <div style="padding:16px 24px 24px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.25);line-height:1.8;">
        Billet non remboursable · Pièce d'identité requise · 16+<br>
        <span style="color:rgba(255,0,128,.4);">No Limit Events © 2026</span>
      </p>
    </div>

  </div>

  <!-- Bottom tagline -->
  <div style="text-align:center;margin-top:24px;">
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,.2);">Des questions ? <a href="mailto:info@nolimitevents.ch" style="color:rgba(255,0,128,.6);text-decoration:none;">info@nolimitevents.ch</a></p>
  </div>

</div>
</div>

</body>
</html>`
    });

    res.status(200).json({success: true});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
};
