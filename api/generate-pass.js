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
    // Debug mode FIRST – parse URL manually (req.query may not be available)
    const urlParams = new URL(req.url, 'https://app.nolimitevents.ch').searchParams;
    if (urlParams.get('debug') === 'nle2026') {
      const dec = v => { try { return Buffer.from((v||'').replace(/\s/g,''),'base64').toString('utf8').substring(0,80); } catch(e) { return 'ERR:'+e.message; } };
      return res.status(200).json({
        v: 'v8',
        cert_raw_start: (process.env.PASS_CERT_B64||'').substring(0,40),
        cert_decoded_start: dec(process.env.PASS_CERT_B64),
        key_decoded_start: dec(process.env.PASS_KEY_B64),
        wwdr_decoded_start: dec(process.env.WWDR_CERT_B64),
        passphrase: process.env.PASS_KEY_PASSPHRASE ? 'SET' : 'EMPTY'
      });
    }

    const { ticketId, eventTitle, eventDate, eventLocation, name } = req.method === 'GET' ? req.query : req.body;

    if (!process.env.PASS_CERT_B64) return res.status(500).json({ error: 'PASS_CERT_B64 manquant dans Vercel env vars' });
    if (!process.env.PASS_KEY_B64)  return res.status(500).json({ error: 'PASS_KEY_B64 manquant dans Vercel env vars' });
    if (!process.env.WWDR_CERT_B64) return res.status(500).json({ error: 'WWDR_CERT_B64 manquant dans Vercel env vars' });

    // Decode base64 env var → PEM string
    const normalizePem = (b64, type = 'CERTIFICATE') => {
      let pem = Buffer.from(b64.replace(/\s/g, ''), 'base64').toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
      // Auto-fix: add missing END marker (happens when Vercel truncates the env var)
      if (pem.includes('-----BEGIN') && !pem.includes('-----END')) {
        pem += `\n-----END ${type}-----`;
      }
      return pem;
    };

    const certPem = normalizePem(process.env.PASS_CERT_B64);
    const keyPem  = normalizePem(process.env.PASS_KEY_B64);
    const wwdrPem = normalizePem(process.env.WWDR_CERT_B64);
    const passphrase = process.env.PASS_KEY_PASSPHRASE || '';

    // Try to parse each cert with forge to pinpoint which one fails
    const forge = require('node-forge');
    try { forge.pki.certificateFromPem(certPem); } catch(e) { return res.status(500).json({ error: 'PASS_CERT_B64 forge error: ' + e.message, start: certPem.substring(0,80), end: certPem.substring(certPem.length-40) }); }
    try { forge.pki.certificateFromPem(wwdrPem); } catch(e) { return res.status(500).json({ error: 'WWDR_CERT_B64 forge error: ' + e.message, start: wwdrPem.substring(0,80), end: wwdrPem.substring(wwdrPem.length-40) }); }
    try { forge.pki.decryptRsaPrivateKey(keyPem, passphrase||undefined); } catch(e) { return res.status(500).json({ error: 'PASS_KEY_B64 forge error: ' + e.message, start: keyPem.substring(0,80), end: keyPem.substring(keyPem.length-40) }); }

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
        wwdr:                wwdrPem,
        signerCert:          certPem,
        signerKey:           keyPem,
        signerKeyPassphrase: passphrase || undefined,
      }
    );

    const buf = await pass.getAsBuffer();

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="${ticketId}.pkpass"`);
    res.status(200).send(buf);
  } catch (err) {
    console.error(err);
    const lines = (err.stack || '').split('\n').slice(0, 6);
    res.status(500).json({ error: err.message, v: 9, where: lines });
  }
};
