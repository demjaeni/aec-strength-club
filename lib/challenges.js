// EDIT VIA ENV VAR: set NEXT_PUBLIC_CHALLENGE_START_DATE in your Vercel project
// settings (or .env.local for local dev) to the real calendar date Day 1 begins.
export const START_DATE = process.env.NEXT_PUBLIC_CHALLENGE_START_DATE || '2026-08-01';

export function getDayNumber(date = new Date()) {
  const [y, m, d] = START_DATE.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((today - start) / 86400000);
  return diff + 1;
}

export const CATEGORY_LABEL = {
  physical: 'Body',
  faith: 'Faith',
  mindset: 'Mind',
  character: 'Character',
  finale: 'Finale',
};

const c = (day, icon, category, text) => ({ day, icon, category, text });

export const CHALLENGES = [
  c(1, '💪', 'physical', 'Walk for 20 minutes.'),
  c(2, '❤️', 'faith', "Read one page of the Qur'an with reflection."),
  c(3, '💪', 'physical', 'Complete 50 bodyweight squats.'),
  c(4, '🧠', 'mindset', 'Spend 10 minutes without your phone.'),
  c(5, '❤️', 'faith', "Pray 2 extra raka'ahs today."),
  c(6, '💪', 'physical', 'Hold a plank for 2 minutes.'),
  c(7, '🤝', 'character', 'Help one person today without expecting anything back.'),
  c(8, '💪', 'physical', 'Complete 30 push-ups (any variation).'),
  c(9, '❤️', 'faith', "Make sincere du'a for three different people."),
  c(10, '💪', 'physical', 'Drink 2 litres of water.'),
  c(11, '🧠', 'mindset', 'No complaining for the entire day.'),
  c(12, '💪', 'physical', 'Walk 8,000 steps.'),
  c(13, '❤️', 'faith', 'Read Surah Al-Mulk tonight.'),
  c(14, '💪', 'physical', 'Stretch for 10 minutes.'),
  c(15, '🤝', 'character', 'Call or visit your parents or another close relative.'),
  c(16, '💪', 'physical', 'Complete 100 squats.'),
  c(17, '❤️', 'faith', "Read two pages of the Qur'an."),
  c(18, '💪', 'physical', 'Walk for 30 minutes.'),
  c(19, '🧠', 'mindset', "Write down three things you're grateful for."),
  c(20, '💪', 'physical', 'Complete 50 lunges.'),
  c(21, '❤️', 'faith', 'Pray all five prayers on time today.'),
  c(22, '💪', 'physical', 'Hold a wall sit for 2 minutes.'),
  c(23, '🤝', 'character', "Give something in charity, even if it's £1."),
  c(24, '💪', 'physical', 'Eat protein with every meal.'),
  c(25, '❤️', 'faith', 'Spend five quiet minutes making dhikr.'),
  c(26, '💪', 'physical', 'Perform 100 calf raises.'),
  c(27, '🧠', 'mindset', 'No social media for two hours before bed.'),
  c(28, '💪', 'physical', 'Walk 10,000 steps.'),
  c(29, '❤️', 'faith', "Read the meanings of five Qur'an verses."),
  c(30, '💪', 'physical', 'Complete 40 burpees (scale if needed).'),
  c(31, '🤝', 'character', 'Smile and greet five people first.'),
  c(32, '💪', 'physical', 'Stretch for 15 minutes.'),
  c(33, '❤️', 'faith', 'Pray the Sunnah prayers you usually miss.'),
  c(34, '💪', 'physical', 'Complete 60 push-ups.'),
  c(35, '🧠', 'mindset', 'Spend 15 minutes reading a beneficial Islamic or educational book.'),
  c(36, '💪', 'physical', 'Walk for 40 minutes.'),
  c(37, '❤️', 'faith', 'Memorise one new ayah or revise one you already know.'),
  c(38, '💪', 'physical', 'Hold a plank for 3 minutes total.'),
  c(39, '🤝', 'character', "Forgive someone you've been holding resentment towards."),
  c(40, '💪', 'physical', 'Complete 150 squats.'),
  c(41, '❤️', 'faith', "Read Surah Al-Kahf (or part of it if it's not Friday)."),
  c(42, '💪', 'physical', 'Perform 60 glute bridges.'),
  c(43, '🧠', 'mindset', "Spend 15 minutes reflecting on one habit you need to improve and write one action you'll take."),
  c(44, '💪', 'physical', 'Complete 60 walking lunges.'),
  c(45, '❤️', 'faith', "Make du'a after every obligatory prayer today."),
  { day: 46, icon: '💪', category: 'physical', intro: 'Complete:', items: ['10 squats', '5 push-ups', '20-second plank'], after: 'Repeat 5 rounds.' },
  c(47, '🤝', 'character', "Message someone you haven't spoken to for a while and ask how they're doing."),
  c(48, '💪', 'physical', 'Walk 12,000 steps.'),
  c(49, '❤️', 'faith', "Read three pages of the Qur'an."),
  c(50, '💪', 'physical', 'Drink only water today.'),
  c(51, '🧠', 'mindset', 'No negative self-talk. Replace every negative thought with one practical action.'),
  c(52, '💪', 'physical', 'Spend 30 minutes outdoors.'),
  c(53, '❤️', 'faith', "Pray two raka'ahs of voluntary prayer in a quiet moment."),
  c(54, '💪', 'physical', 'No processed snacks today.'),
  c(55, '🤝', 'character', 'Thank someone who has had a positive impact on your life.'),
  c(56, '💪', 'physical', 'Walk for 45 minutes.'),
  c(57, '❤️', 'faith', 'Learn one new Name of Allah, its meaning and how it should affect your life.'),
  c(58, '💪', 'physical', 'Drink at least 2.5 litres of water.'),
  c(59, '🧠', 'mindset', 'Spend 20 minutes planning your goals for the next month instead of scrolling.'),
  {
    day: 60, icon: '🏁', category: 'finale', title: 'The Strong Man Challenge',
    blocks: [
      { intro: 'Complete:', items: ['100 squats', '50 push-ups', '100 walking lunges', '3-minute plank', '30-minute walk'] },
      { intro: 'Then finish by:', items: ["Reading one page of the Qur'an.", "Praying two raka'ahs.", "Making du'a for every brother in AEC Strength Club."] },
    ],
  },
];
