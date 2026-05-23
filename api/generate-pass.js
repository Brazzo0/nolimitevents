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
    // Debug mode FIRST – before any processing
    if ((req.query || {}).debug === 'nle2026') {
      const dec = v => { try { return Buffer.from((v||'').replace(/\s/g,''),'base64').toString('utf8').substring(0,80); } catch(e) { return 'ERR:'+e.message; } };
      return res.status(200).json({
        v: 'v6',
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

    // Decode base64 env var → PEM string (strips whitespace from b64 to handle Vercel line-break quirks)
    const normalizePem = b64 => Buffer.from(b64.replace(/\s/g, ''), 'base64').toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    const certPem = normalizePem(process.env.PASS_CERT_B64);
    const keyPem  = normalizePem(process.env.PASS_KEY_B64);
    const wwdrPem = normalizePem(process.env.WWDR_CERT_B64);
    const passphrase = process.env.PASS_KEY_PASSPHRASE || '';

    if (!certPem.includes('-----BEGIN CERTIFICATE-----')) return res.status(500).json({ error: 'PASS_CERT_B64 invalide: ' + certPem.substring(0,60) });
    if (!keyPem.includes('-----BEGIN')) return res.status(500).json({ error: 'PASS_KEY_B64 invalide: ' + keyPem.substring(0,60) });
    if (!wwdrPem.includes('-----BEGIN CERTIFICATE-----')) return res.status(500).json({ error: 'WWDR_CERT_B64 invalide: ' + wwdrPem.substring(0,60) });

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

    // Build pass metadata (no eventTicket here – type set separately)
    const { eventTicket, ...passMeta } = passJson;

    const pass = new PKPass(
      {
        'icon.png':    iconBuf,
        'icon@2x.png': iconBuf,
        'logo.png':    iconBuf,
        'logo@2x.png': iconBuf,
      },
      {
        wwdr:       wwdrPem,
        signerCert: certPem,
        signerKey:  passphrase ? { keyFile: keyPem, passphrase } : keyPem,
      },
      passMeta
    );

    // In passkit-generator v3, type must be set explicitly AFTER construction
    pass.type = 'eventTicket';

    // Set fields programmatically
    if (eventTicket?.primaryFields)   pass.primaryFields.push(...eventTicket.primaryFields);
    if (eventTicket?.secondaryFields) pass.secondaryFields.push(...eventTicket.secondaryFields);
    if (eventTicket?.auxiliaryFields) pass.auxiliaryFields.push(...eventTicket.auxiliaryFields);
    if (eventTicket?.backFields)      pass.backFields.push(...eventTicket.backFields);

    const buf = await pass.getAsBuffer();

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="${ticketId}.pkpass"`);
    res.status(200).send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
