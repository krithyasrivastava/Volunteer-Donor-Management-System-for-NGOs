import { useEffect, useState } from 'react';
import { skillService } from '../../services/resources';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function VolunteerSkills() {
  const [mySkills, setMySkills] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const { push } = useToast();

  const load = () => skillService.mine().then(setMySkills).catch((e) => setError(e.response?.data?.message || 'Failed to load skills.'));
  useEffect(() => { load(); skillService.list().then(setAllSkills); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await skillService.addMine({ skill_id: selected, proficiency });
      push('Skill added.');
      setSelected('');
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not add skill.', 'error');
    }
  };

  const remove = async (skillId) => {
    try {
      await skillService.removeMine(skillId);
      push('Skill removed.');
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not remove skill.', 'error');
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!mySkills) return <Loading />;

  const available = allSkills.filter((s) => !mySkills.some((m) => m.skill_id === s.skill_id));

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">My skills</h2>
        <p className="text-sm text-forest-500 mt-1">Skills help us match you to events that need your strengths.</p>
      </div>

      <form onSubmit={add} className="card flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="field-label">Skill</label>
          <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select a skill…</option>
            {available.map((s) => <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Proficiency</label>
          <select className="input" value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
            <option>Beginner</option><option>Intermediate</option><option>Expert</option>
          </select>
        </div>
        <button className="btn-primary">Add skill</button>
      </form>

      <div className="card">
        <h3 className="font-semibold text-forest-900 mb-3">Your skills</h3>
        {mySkills.length ? (
          <div className="space-y-2">
            {mySkills.map((s) => (
              <div key={s.skill_id} className="flex items-center justify-between rounded-lg border border-forest-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-forest-800">{s.skill_name}</p>
                  <p className="text-xs text-forest-500">{s.proficiency}</p>
                </div>
                <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => remove(s.skill_id)}>Remove</button>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No skills added yet" subtitle="Add skills so admins can match you to suitable events." />}
      </div>
    </div>
  );
}
