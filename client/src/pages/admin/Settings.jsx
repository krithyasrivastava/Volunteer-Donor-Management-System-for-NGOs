import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/resources';
import { useToast } from '../../components/Toast';
import { EmptyState } from '../../components/States';

export default function AdminSettings() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_name: '', description: '' });
  const { push } = useToast();

  const loadSkills = () => skillService.list().then(setSkills);
  useEffect(() => { loadSkills(); }, []);

  const addSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill_name.trim()) return;
    try {
      await skillService.create(newSkill);
      push('Skill added to catalog.');
      setNewSkill({ skill_name: '', description: '' });
      loadSkills();
    } catch (err) {
      push(err.response?.data?.message || 'Could not add skill.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Settings</h2>
        <p className="text-sm text-forest-500 mt-1">Manage your account and the organization-wide skill catalog.</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-forest-900 mb-3">Admin profile</h3>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between"><dt className="text-forest-500">Name</dt><dd className="text-forest-800">{user?.name}</dd></div>
          <div className="flex justify-between"><dt className="text-forest-500">Email</dt><dd className="text-forest-800">{user?.email}</dd></div>
        </dl>
      </div>

      <div className="card">
        <h3 className="font-semibold text-forest-900 mb-3">Skill catalog</h3>
        <p className="text-sm text-forest-500 mb-4">These skills are used across volunteer profiles and event requirements.</p>

        <form onSubmit={addSkill} className="flex flex-wrap gap-2 mb-4">
          <input className="input max-w-[200px]" placeholder="Skill name" value={newSkill.skill_name} onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })} />
          <input className="input flex-1" placeholder="Description (optional)" value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })} />
          <button className="btn-primary">Add skill</button>
        </form>

        {skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => <span key={s.skill_id} className="badge-teal">{s.skill_name}</span>)}
          </div>
        ) : <EmptyState title="No skills yet" />}
      </div>
    </div>
  );
}
