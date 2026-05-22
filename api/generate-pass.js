const { PKPass } = require('passkit-generator');
const https = require('https');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { ticketId, eventTitle, eventDate, eventLocation, name } = req.method === 'GET' ? req.query : req.body;

    if (!process.env.PASS_CERT_B64) return res.status(500).json({ error: 'PASS_CERT_B64 manquant dans Vercel env vars' });
    if (!process.env.PASS_KEY_B64)  return res.status(500).json({ error: 'PASS_KEY_B64 manquant dans Vercel env vars' });
    if (!process.env.WWDR_CERT_B64) return res.status(500).json({ error: 'WWDR_CERT_B64 manquant dans Vercel env vars' });

    const clean = b64 => Buffer.from(b64, 'base64').toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const certPem = clean(process.env.PASS_CERT_B64);
    const keyPem  = clean(process.env.PASS_KEY_B64);
    const wwdrPem = clean(process.env.WWDR_CERT_B64);
    const passphrase = process.env.PASS_KEY_PASSPHRASE || '';

    const iconBuf = await fetchBuffer('https://app.nolimitevents.ch/logo_transparent.png');

    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.ch.nolimitevents.ticket',
      serialNumber: ticketId,
      teamIdentifier: '6BWR2R97AU',
      organizationName: 'No Limit Events',
      description: `Billet – ${eventTitle}`,
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(13, 17, 23)',
      labelColor: 'rgb(255, 0, 128)',
      logoText: 'No Limit Events',
      eventTicket: {
        primaryFields: [
          { key: 'event', label: 'ÉVÉNEMENT', value: eventTitle }
        ],
        secondaryFields: [
          { key: 'date',     label: 'DATE', value: eventDate },
          { key: 'location', label: 'LIEU', value: eventLocation }
        ],
        auxiliaryFields: [
          { key: 'holder', label: 'TITULAIRE', value: name || 'No Limiter' }
        ],
        backFields: [
          { key: 'ticketid', label: 'ID DU BILLET', value: ticketId },
          { key: 'info',     label: 'INFORMATIONS', value: 'Billet non remboursable · Pièce d\'identité requise · 16+' },
          { key: 'contact',  label: 'CONTACT',      value: 'info@nolimitevents.ch' }
        ]
      },
      barcodes: [{
        message: ticketId,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }],
      barcode: {
        message: ticketId,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }
    };

    const pass = new PKPass(
      {
        'pass.json':   Buffer.from(JSON.stringify(passJson)),
        'icon.png':    iconBuf,
        'icon@2x.png': iconBuf,
        'logo.png':    iconBuf,
        'logo@2x.png': iconBuf,
      },
      {
        wwdr:       wwdrPem,
        signerCert: certPem,
        signerKey:  passphrase ? { keyFile: keyPem, passphrase } : keyPem,
      }
    );

    const buf = await pass.getAsBuffer();

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="${ticketId}.pkpass"`);
    res.status(200).send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
