/** Allowed values for the booking form and admin dropdowns. The frontend reads these from GET /api/form-options. */

const INTERESTS = [
  'Hatha Foundations',
  'Vinyasa Flow',
  'Pranayama and Meditation',
  'Back and Neck Care',
  'Prenatal Yoga',
  'Yoga Nidra',
  'Private 1:1 Sessions',
  'Corporate and Group Sessions',
  'Not sure yet, help me choose',
];
const LEVELS = ['Brand new to yoga', 'Some practice', 'Regular practitioner'];
const MODES = ['In the studio', 'Online live', 'Either works'];
const TIMES = ['Early morning', 'Late morning', 'Evening', 'Weekend', 'Flexible'];

const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'trial_booked', label: 'Trial booked' },
  { value: 'joined', label: 'Joined' },
  { value: 'closed', label: 'Closed' },
];
const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value);
const REVIEW_STATUSES = ['pending', 'approved', 'hidden'];

module.exports = { INTERESTS, LEVELS, MODES, TIMES, LEAD_STATUSES, LEAD_STATUS_VALUES, REVIEW_STATUSES };
