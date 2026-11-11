import type { Comparison } from '@/lib/types';

/**
 * Comparison table. These are draft positioning statements: confirm every row is true for
 * your studio before publishing, and edit freely.
 */
export const COMPARE: Comparison = {
  columns: ['Yovana Yoga', 'Large chain studios', 'Free videos and apps'],
  rows: [
    {
      label: 'Teacher attention',
      us: 'Small batches, so the teacher sees and corrects every student',
      chain: 'Bigger rooms, so individual correction is harder to come by',
      free: 'Nobody is watching your form',
    },
    {
      label: 'Built around your body',
      us: 'We ask about injuries, sleep and goals before your first class',
      chain: 'The same class for everyone in the room',
      free: 'Generic routines for a generic viewer',
    },
    {
      label: 'Beginners',
      us: 'A dedicated foundations class where nothing is assumed',
      chain: 'Beginners often join mixed-level classes',
      free: 'Easy to pick a routine that is too hard and get hurt',
    },
    {
      label: 'Breathwork',
      us: 'Pranayama is part of every class, not an add-on',
      chain: 'Usually a few minutes at the end, if at all',
      free: 'Often skipped in favour of poses',
    },
    {
      label: 'Online option',
      us: 'Live classes where the teacher can see and speak to you',
      chain: 'Varies by studio',
      free: 'Pre-recorded, no feedback',
    },
    {
      label: 'Accountability',
      us: 'A teacher who knows your name and notices when you are missing',
      chain: 'Depends on how busy the studio is',
      free: 'Entirely up to you',
    },
    {
      label: 'Trying it out',
      us: 'A free trial class, with no pressure to sign up',
      chain: 'Policies differ between studios',
      free: 'Free, but with no guidance',
    },
  ],
  honest:
    'If you already have a steady home practice and a good teacher in your head, free videos are a perfectly good way to keep going. Where a studio earns its fee is in the first months, when someone needs to watch how you move, and in the long run when you want to go deeper than a video can take you.',
};
