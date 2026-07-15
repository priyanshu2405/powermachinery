'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, LogOut, Plus, Trash2, Edit2, X } from 'lucide-react';
import styles from './page.module.css';

const API_BASE = 'https://mbcrushings-api.onrender.com/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settings');
  
  // Settings State
  const [settings, setSettings] = useState({ company_name: '', phone: '', email: '', address: '' });
  
  // Team State
  const [team, setTeam] = useState([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Equipment State
  const [equipments, setEquipments] = useState([]);
  const [showEqForm, setShowEqForm] = useState(false);
  const [currentEq, setCurrentEq] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      fetch(`${API_BASE}/settings`).then(res => res.json()),
      fetch(`${API_BASE}/team`).then(res => res.json()),
      fetch(`${API_BASE}/equipments`).then(res => res.json())
    ])
    .then(([settingsData, teamData, eqData]) => {
      setSettings(settingsData);
      setTeam(teamData);
      setEquipments(eqData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  // --- Settings Handlers ---
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('adminToken');
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch(`${API_BASE}/settings/${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ value })
        });
      }
      setMessage({ text: 'Settings updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update settings', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // --- Team Handlers ---
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    const id = currentMember?.id;
    const url = id ? `${API_BASE}/team/${id}` : `${API_BASE}/team`;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error('Failed to save');
      const newTeam = await fetch(`${API_BASE}/team`).then(r => r.json());
      setTeam(newTeam);
      setShowTeamForm(false);
      setCurrentMember(null);
      setMessage({ text: 'Team member saved!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const deleteTeamMember = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setTeam(team.filter(m => m.id !== id));
      setMessage({ text: 'Deleted successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to delete', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // --- Equipment Handlers ---
  const handleEqSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    const id = currentEq?.id;
    const url = id ? `${API_BASE}/equipments/${id}` : `${API_BASE}/equipments`;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error('Failed to save');
      const newEq = await fetch(`${API_BASE}/equipments`).then(r => r.json());
      setEquipments(newEq);
      setShowEqForm(false);
      setCurrentEq(null);
      setMessage({ text: 'Equipment saved!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to save equipment', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const deleteEq = async (id) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_BASE}/equipments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      setEquipments(equipments.filter(e => e.id !== id));
      setMessage({ text: 'Deleted successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to delete', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return <div className={styles.loading}><Loader2 className="animate-spin" size={48} color="var(--primary-color)" /></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          <LogOut size={18} /> Logout
        </button>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.sidebar}>
          <div className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`} onClick={() => setActiveTab('settings')}>
            Global Settings
          </div>
          <div className={`${styles.navItem} ${activeTab === 'team' ? styles.active : ''}`} onClick={() => { setActiveTab('team'); setShowTeamForm(false); }}>
            Team Members
          </div>
          <div className={`${styles.navItem} ${activeTab === 'equipment' ? styles.active : ''}`} onClick={() => { setActiveTab('equipment'); setShowEqForm(false); }}>
            Equipment Gallery
          </div>
          <div className={styles.navItem}>Projects (Coming Soon)</div>
        </div>
        
        <div className={styles.content}>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={`${styles.card} glass`}>
              <h2>Global Site Settings</h2>
              <p className={styles.subtitle}>Update the company contact information displayed across the website.</p>
              <form onSubmit={handleSettingsSave} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Company Name</label>
                  <input type="text" className="input-field" value={settings.company_name || ''} onChange={(e) => handleSettingsChange('company_name', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="text" className="input-field" value={settings.phone || ''} onChange={(e) => handleSettingsChange('phone', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" className="input-field" value={settings.email || ''} onChange={(e) => handleSettingsChange('email', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Corporate Address</label>
                  <textarea className="input-field" rows="3" value={settings.address || ''} onChange={(e) => handleSettingsChange('address', e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Settings</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className={`${styles.card} glass`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2>Team Management</h2>
                  <p className={styles.subtitle} style={{ marginBottom: 0 }}>Add, edit, or remove leadership profiles.</p>
                </div>
                {!showTeamForm && (
                  <button className="btn btn-primary" onClick={() => { setCurrentMember(null); setShowTeamForm(true); }}>
                    <Plus size={18} /> Add Member
                  </button>
                )}
              </div>
              
              {showTeamForm ? (
                <div className={styles.formWrapper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>{currentMember ? 'Edit Member' : 'Add New Member'}</h3>
                    <button type="button" onClick={() => setShowTeamForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                  </div>
                  <form onSubmit={handleTeamSubmit} className={styles.form} encType="multipart/form-data">
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input type="text" name="name" className="input-field" defaultValue={currentMember?.name || ''} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Role / Title</label>
                      <input type="text" name="role" className="input-field" defaultValue={currentMember?.role || ''} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Biography</label>
                      <textarea name="bio" className="input-field" rows="4" defaultValue={currentMember?.bio || ''}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Profile Image (Optional)</label>
                      <input type="file" name="image" className="input-field" accept="image/*" />
                      {currentMember?.imageUrl && <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Leave blank to keep current image.</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label>Display Order</label>
                      <input type="number" name="display_order" className="input-field" defaultValue={currentMember?.display_order || 0} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Member</>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map(member => (
                        <tr key={member.id}>
                          <td style={{ fontWeight: 500 }}>{member.name}</td>
                          <td>{member.role}</td>
                          <td>{member.display_order}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setCurrentMember(member); setShowTeamForm(true); }} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></button>
                              <button onClick={() => deleteTeamMember(member.id)} className={`${styles.iconBtn} ${styles.danger}`} title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className={`${styles.card} glass`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2>Equipment Gallery</h2>
                  <p className={styles.subtitle} style={{ marginBottom: 0 }}>Manage the fleet shown on the Equipment page.</p>
                </div>
                {!showEqForm && (
                  <button className="btn btn-primary" onClick={() => { setCurrentEq(null); setShowEqForm(true); }}>
                    <Plus size={18} /> Add Equipment
                  </button>
                )}
              </div>
              
              {showEqForm ? (
                <div className={styles.formWrapper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>{currentEq ? 'Edit Equipment' : 'Add New Equipment'}</h3>
                    <button type="button" onClick={() => setShowEqForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                  </div>
                  <form onSubmit={handleEqSubmit} className={styles.form} encType="multipart/form-data">
                    <div className={styles.formGroup}>
                      <label>Equipment Name</label>
                      <input type="text" name="name" className="input-field" defaultValue={currentEq?.name || ''} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Category (e.g., Earthmoving)</label>
                      <input type="text" name="category" className="input-field" defaultValue={currentEq?.category || ''} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Equipment Image (Optional)</label>
                      <input type="file" name="image" className="input-field" accept="image/*" />
                      {currentEq?.imageUrl && <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Leave blank to keep current image.</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label>Display Order</label>
                      <input type="number" name="display_order" className="input-field" defaultValue={currentEq?.display_order || 0} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Equipment</>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipments.map(eq => (
                        <tr key={eq.id}>
                          <td style={{ fontWeight: 500 }}>{eq.name}</td>
                          <td>{eq.category}</td>
                          <td>{eq.display_order}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setCurrentEq(eq); setShowEqForm(true); }} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></button>
                              <button onClick={() => deleteEq(eq.id)} className={`${styles.iconBtn} ${styles.danger}`} title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
