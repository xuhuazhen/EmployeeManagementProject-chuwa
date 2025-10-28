import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'x-demo-userid': 'user-0001' } // 临时代替登录
});

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required()
});

export default function Onboarding() {
  const [docs, setDocs] = useState([]);
  const [avatar, setAvatar] = useState('');
  const { register, handleSubmit, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchMe = async () => {
    const { data } = await api.get('/onboarding/me');
    if (data?.documents) setDocs(data.documents);
    if (data?.profilePicture?.url) setAvatar(data.profilePicture.url);
    reset({
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      email: data?.email || ''
    });
  };

  useEffect(() => { fetchMe(); }, []);

  const onSubmit = async (vals) => {
    await api.post('/onboarding/me', {
      firstName: vals.firstName,
      lastName: vals.lastName,
      email: vals.email
    });
    await fetchMe();
    alert('Submitted!');
  };

  const uploadAvatar = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const form = new FormData();
    form.append('file', f);
    const { data } = await api.post('/onboarding/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setAvatar(data.url);
  };

  const uploadFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const form = new FormData();
    form.append('file', f);
    form.append('label', 'generic');
    const { data } = await api.post('/onboarding/me/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setDocs(prev => [data, ...prev]);
  };

  const isMobile = window.innerWidth <= 430;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? 12 : 24 }}>
      <h2>Onboarding Application</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '160px 1fr', gap: 16, alignItems: 'start' }}>
        <div>
          <img
            src={avatar || 'https://placehold.co/120x120?text=Avatar'}
            alt="avatar"
            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
          />
          <div style={{ marginTop: 8 }}>
            <input type="file" accept="image/*,application/pdf" onChange={uploadAvatar} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 8 }}>
            <label>First Name</label><br />
            <input {...register('firstName')} placeholder="John" />
            <div style={{ color: 'crimson' }}>{errors.firstName?.message}</div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Last Name</label><br />
            <input {...register('lastName')} placeholder="Doe" />
            <div style={{ color: 'crimson' }}>{errors.lastName?.message}</div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Email</label><br />
            <input {...register('email')} placeholder="user@example.com" />
            <div style={{ color: 'crimson' }}>{errors.email?.message}</div>
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={() => reset()} style={{ marginLeft: 8 }}>Reset</button>
        </form>
      </div>

      <hr style={{ margin: '16px 0' }} />

      <h3>Documents</h3>
      <input type="file" onChange={uploadFile} />
      <div style={{ marginTop: 12 }}>
        {docs.length === 0 ? 'No documents yet.' : docs.map((d, i) => (
          <div key={i} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8, marginBottom: 8 }}>
            <div><strong>{d.originalName}</strong></div>
            <div style={{ fontSize: 12, color: '#666' }}>{d.label} · {(d.size/1024).toFixed(1)} KB · {d.mime}</div>
            <div style={{ marginTop: 4 }}>
              <a href={d.url} target="_blank" rel="noreferrer">Preview</a>
              {' | '}
              <a href={d.url.replace('/raw/', '/download/')}>Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
