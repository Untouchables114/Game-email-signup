const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // allows your game (running in a browser) to talk to this server

// ⬇️ FILL THESE TWO IN ⬇️
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZTZiYTRjMzNiNTU3ZTU4NzVmMzBlNTgwYTY0MDcxNjRhOTA2MzJlNjgzODBiYWRkNDIwNDQ1OGVhZjYyMmFhMDZiZjZkMmZhOTVkNmY4MzAiLCJpYXQiOjE3ODcxMTAwNDMuMzY3NDg1LCJuYmYiOjE3ODcxMTAwNDMuMzY3NDg3LCJleHAiOjQ5NDI3ODM2NDMuMzYyODgyLCJzdWIiOiIyNjAyMzQ0Iiwic2NvcGVzIjpbXX0.eU46LDU7UoKSEZbVjLyXZaUjar9E0WNADtDvTxR-XEclYPU6TH_g1g3v6Zvcw1coRN2qOYWuVxzU_WdirFXNGKkaeKwgFk4IqJJhQpqlBvcFeV_c90_CY17Nt9-sHeWE_0Z-BOi3PebiUKRce3xkAOULox9jOt3pBdAC1xJXTXHw8A_9jl-NZRWPb_RybVHJ5GuIoKhFGkAIDXe_dpsAVjVzkCJk8K8OwklwxjlvlGlkGfh_FZps-yjsgvMCoJ9W6BJyABrlgp3sEEIA0dK9-y3xnCZccihJBuue852dCfAP8C5OoYroqm_mJ7FbBfGgY4_AFBiQPt0F1EZilD4M9T_Cn_tfZm9iphijYX185ad0azxjiOLt1tmdgkqwOriqe3AnWpzwXu9yqhAqtzB3IwEazLvmXXYaCVQSSvv6NqtYDLMAL_q_OYSV3SFMtyu5PtC3jl9uF1vMDk0Wg8c-I3lxEDnuSIJzRKziCtf6IuLghjCTXSOWLsr5ubUy2oDumnVUdf34v8d7wrB6RYZfyz4Bk0_RD7OnRxMqz3x3wpd0zJ-qeK_PgMXuLBR7KSi2jePJtRObTBsXqwvYy0y2nublMvEGhVG4PGhxR0koERLxJVn1f51whZ5TIFMBxrosYbQrugQKfPsMUNC2O-xGdhNHQox-JpX1wRgguh9K0GM';
const GROUP_ID = '196198970222970725';

app.post('/signup', async (req, res) => {
  const { email } = req.body;

  // basic check — don't bother MailerLite with obviously invalid input
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
  }

  try {
    const response = await fetch(`https://connect.mailerlite.com/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
  email: email,
  groups: [GROUP_ID]
})
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite error:', data);
      return res.status(500).json({ success: false, message: 'Something went wrong, try again.' });
    }

    // Success — MailerLite will now automatically email the player to confirm (double opt-in)
    res.json({ success: true, message: 'Check your email to confirm!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error, try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Signup server running on port ${PORT}`));
