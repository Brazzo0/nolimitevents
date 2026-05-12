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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { ticketId, eventTitle, eventDate, eventLocation, name } = req.body;

    const certPem   = Buffer.from(process.env.PASS_CERT_B64, 'base64').toString('utf8');
    const keyPem    = Buffer.from(process.env.PASS_KEY_B64,  'base64').toString('utf8');
    const wwdrPem   = Buffer.from(process.env.WWDR_CERT_B64, 'base64').toString('utf8');

    const iconBuf = await fetchBuffer('https://nolimitevents.vercel.app/logo512.png');

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

    const pass = await PKPass.from({
      model: {
        'pass.json':    Buffer.from(JSON.stringify(passJson)),
        'icon.png':     iconBuf,
        'icon@2x.png':  iconBuf,
        'logo.png':     iconBuf,
        'logo@2x.png':  iconBuf,
      },
      certificates: {
        wwdr:       wwdrPem,
        signerCert: certPem,
        signerKey:  keyPem,
      }
    }, { serialNumber: ticketId });

    const buf = pass.getAsBuffer();

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="${ticketId}.pkpass"`);
    res.status(200).send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
