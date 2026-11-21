/**
 * Explainable volunteer <-> event matching.
 *
 * For each candidate volunteer we compute a transparent score out of 100:
 *   - up to 70 points for the share of the event's required skills the volunteer has
 *   - 20 points if the volunteer's stated availability is "Flexible" or otherwise
 *     compatible (kept simple/explainable: Flexible always counts, others get partial credit)
 *   - up to 10 points based on average proficiency across matched skills
 *
 * Only volunteers who are Approved, and not already registered for the event,
 * are considered eligible in the first place (filtered before this function runs).
 */

const PROFICIENCY_WEIGHT = { Beginner: 1, Intermediate: 2, Expert: 3 };

function scoreVolunteer(volunteer, requiredSkillIds) {
  const volunteerSkillIds = volunteer.skills.map((s) => s.skill_id);
  const matchedSkills = volunteer.skills.filter((s) => requiredSkillIds.includes(s.skill_id));

  const skillCoverage = requiredSkillIds.length
    ? matchedSkills.length / requiredSkillIds.length
    : volunteerSkillIds.length
    ? 1
    : 0;

  const skillPoints = skillCoverage * 70;

  const availabilityPoints = volunteer.availability === 'Flexible' ? 20 : 12;

  const avgProficiency = matchedSkills.length
    ? matchedSkills.reduce((sum, s) => sum + (PROFICIENCY_WEIGHT[s.proficiency] || 2), 0) /
      matchedSkills.length
    : 0;
  const proficiencyPoints = (avgProficiency / 3) * 10;

  const rawScore = skillPoints + availabilityPoints + proficiencyPoints;
  const score = Math.min(100, Math.round(rawScore));

  const reasons = matchedSkills.map((s) => s.skill_name);

  return { score, matchedSkills: reasons, matchedCount: matchedSkills.length };
}

function rankVolunteersForEvent(volunteers, requiredSkillIds) {
  return volunteers
    .map((v) => {
      const { score, matchedSkills, matchedCount } = scoreVolunteer(v, requiredSkillIds);
      return {
        volunteer_id: v.volunteer_id,
        name: v.name,
        email: v.email,
        availability: v.availability,
        matched_skills: matchedSkills,
        matched_count: matchedCount,
        match_score: score
      };
    })
    .sort((a, b) => b.match_score - a.match_score);
}

module.exports = { rankVolunteersForEvent };
