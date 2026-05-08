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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}&bgcolor=ffffff&color=000000`;
    const prenom = name.split(' ')[0] || name;

    await resend.emails.send({
      from: 'No Limit Events <info@nolimitevents.ch>',
      to: email,
      subject: `Ton billet - ${eventTitle}`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ton Billet - ${eventTitle}</title>
</head>
<body style="font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#121212;color:#FFFFFF;margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh;">
  <div style="background-color:#1E1E1E;width:100%;max-width:350px;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);margin:0 auto;">
    
    <div style="background-color:#FF10F0;padding:20px;text-align:center;">
      <h1 style="font-size:24px;font-weight:800;text-transform:uppercase;color:#000000;margin:0;letter-spacing:2px;">${eventTitle}</h1>
    </div>

    <div style="padding:25px;">
      
      <div style="text-align:center;margin-bottom:30px;">
        <h2 style="font-size:18px;font-weight:600;color:#AAAAAA;margin:0 0 5px 0;">C'est confirmé, ${prenom} !</h2>
        <p style="font-size:14px;color:#888888;margin:0;">Ton accès pour la soirée sans limites.</p>
      </div>

      <div style="border-top:1px solid #333333;border-bottom:1px solid #333333;padding:15px 0;display:flex;justify-content:space-between;margin-bottom:30px;">
        <div style="flex:1;text-align:left;">
          <strong style="display:block;font-size:12px;color:#FF10F0;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Quand</strong>
          <span style="font-size:16px;font-weight:600;">${eventDate}</span>
        </div>
        <div style="flex:1;text-align:right;">
          <strong style="display:block;font-size:12px;color:#FF10F0;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Où</strong>
          <span style="font-size:16px;font-weight:600;">${eventLocation}<br>La Chaux-de-Fonds</span>
        </div>
      </div>

      <div style="text-align:center;background-color:#FFFFFF;padding:15px;border-radius:8px;margin-bottom:15px;display:inline-block;position:relative;left:50%;transform:translateX(-50%);">
        <img src="${qrUrl}" alt="QR Code" width="150" height="150" style="display:block;"/>
      </div>
      
      <div style="text-align:center;">
        <p style="font-family:'Courier New',Courier,monospace;font-size:14px;color:#AAAAAA;margin-top:10px;">ID: ${ticketId}</p>
        <p style="font-size:14px;color:#AAAAAA;margin:5px 0 0 0;">Présente ce code à l'entrée</p>
      </div>

    </div>

    <div style="padding:15px 25px 25px 25px;font-size:12px;color:#666666;text-align:center;border-top:1px solid #333333;">
      <p style="margin:0;">Billet non remboursable • Pièce d'identité requise</p>
      <p style="margin-top:5px;">No Limit Events © 2026</p>
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
