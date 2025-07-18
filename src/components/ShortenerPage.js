import React, { useState } from 'react';
import { Log } from '../utils/log';
import { TextField, Button, Box, Typography } from '@mui/material';

function ShortenerPage() {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyb2hpdC5zaGFybWE4QHMuYW1pdHkuZWR1IiwiZXhwIjoxNzUyODE5Nzg1LCJpYXQiOjE3NTI4MTg4ODUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1MmJhNDk4Yy1kNzhlLTQ4OTctOTNjYS02YjM3MzUxZTU5YjEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyb2hpdCBzaGFybWEiLCJzdWIiOiIzMmU2NGQzNC01NmViLTQ4NTItYmY5NS05NjE0NjQyMzc5MWMifSwiZW1haWwiOiJyb2hpdC5zaGFybWE4QHMuYW1pdHkuZWR1IiwibmFtZSI6InJvaGl0IHNoYXJtYSIsInJvbGxObyI6ImE2MDIwNTIyMjEwOCIsImFjY2Vzc0NvZGUiOiJKcHplclEiLCJjbGllbnRJRCI6IjMyZTY0ZDM0LTU2ZWItNDg1Mi1iZjk1LTk2MTQ2NDIzNzkxYyIsImNsaWVudFNlY3JldCI6Im1CckZYRG1Ea1JYd3dxVGIifQ.ffaO9UiTzCMSSxZ6u_7daDpp_-pOzRqaxhLeETrEgxI');

  const handleChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    urls.forEach((u, idx) => {
      if (!validateUrl(u.longUrl)) {
        valid = false;
        Log("frontend", "error", "component", `Invalid URL at position ${idx + 1}`, token);
      }
      if (u.validity && isNaN(Number(u.validity))) {
        valid = false;
        Log("frontend", "error", "component", `Invalid validity at position ${idx + 1}`, token);
      }
      if (u.shortcode && !/^[a-zA-Z0-9]{1,10}$/.test(u.shortcode)) {
        valid = false;
        Log("frontend", "error", "component", `Invalid shortcode at position ${idx + 1}`, token);
      }
    });
    if (!valid) return;

    const newResults = urls.map((u, idx) => {
      let code = u.shortcode || Math.random().toString(36).substring(2, 8);
      let expiry = new Date(Date.now() + ((u.validity ? Number(u.validity) : 30) * 60000));
      Log("frontend", "info", "component", `Shortened URL created for ${u.longUrl} with code ${code}`, token);
      return {
        original: u.longUrl,
        short: `http://localhost:3000/${code}`,
        expiry: expiry.toLocaleString(),
        shortcode: code
      };
    });
    setResults(newResults);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">URL Shortener</Typography>
      {urls.map((u, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <TextField
            label="Long URL"
            value={u.longUrl}
            onChange={e => handleChange(idx, 'longUrl', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Validity (minutes)"
            value={u.validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)}
            sx={{ mr: 1 }}
          />
          <TextField
            label="Custom Shortcode"
            value={u.shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)}
            sx={{ mr: 1 }}
          />
        </Box>
      ))}
      <Button onClick={addUrlField} disabled={urls.length >= 5}>Add Another URL</Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>Shorten URLs</Button>
      <Box sx={{ mt: 3 }}>
        {results.map((r, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography>Original: {r.original}</Typography>
            <Typography>Shortened: <a href={r.short}>{r.short}</a></Typography>
            <Typography>Expiry: {r.expiry}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ShortenerPage;
