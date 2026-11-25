// Every unit the desk can play. A unit is a folder with sources.js and shifts.js; see docs/UNITS.md.
import acadie1 from './acadie-1/index.js';

export const UNITS = [acadie1];

// Shown on the title screen, greyed out, so students see where the desk is going.
export const COMING = [
  { course: 'Grade 8 Social Studies', title: 'British North America', era: '1760s–1867' },
  { course: 'Grade 7 Culture', title: 'The dawn of civilization', era: 'Before writing, and after' },
];
