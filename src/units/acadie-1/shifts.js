// Acadie 1's shifts. The task types are in src/engine/tasks.js; docs/UNITS.md explains every field.
//
// Refs point at proof: 'doc#words in the sentence' or 'doc@by' (a label line). `near` refs are lines that are close but
// not proof; each gets its own hint. `npm run check` makes sure every ref finds exactly one line.

const HEAD = 'The Head Archivist';
const CH_WHEN = (doc) => ({ [`${doc}@when`]: '1613 is old, but old is not enough. Who made it, and were they there?' });

export const SHIFTS = [
  // ------------------------------------------------------------------ 1
  {
    id: 'stamp', title: 'Stamp it', short: 'Stamp',
    letter: {
      from: HEAD,
      text: [
        'Welcome to the Archive. Documents about the winter of 1604–05 on Sainte-Croix are piling up, and every one needs a stamp: PRIMARY or SECONDARY.',
        'The rule in this office: no stamp without proof. After you stamp a document, point at the line that proves it. The label at the top counts too.',
        'One more thing. Words with a dotted line are worth keeping. Click one to put it in your notebook. You will need them later.',
      ],
    },
    tasks: [
      {
        type: 'stamp', doc: 'ch-island', answer: 'primary',
        proof: ['ch-island@by', 'ch-island#we found an', 'ch-island#under our', 'ch-island#We also picked it', 'ch-island#We hoped to end'],
        near: CH_WHEN('ch-island'),
        right: 'Primary. Champlain was there. Listen to him: “we found”, “our cannon”. Only someone on the trip could write that.',
        wrong: 'This one is primary. Champlain sailed with de Mons and saw the island himself. He writes “we found”.',
        consequence: 'A museum label called Champlain’s book “a history written long after”. A visitor who knows Champlain wrote in to complain.',
      },
      {
        type: 'stamp', doc: 'nps-summer', answer: 'secondary',
        proof: ['nps-summer@by', 'nps-summer@when'],
        near: { 'nps-summer#reached': 'That tells what happened, not who wrote it or when. Look at the label at the top.' },
        right: 'Secondary. The Park Service wrote this in our time, more than 400 years later, from older sources.',
        wrong: 'This one is secondary. It is a web page from 2021 or later. Nobody at the Park Service was there in 1604.',
        consequence: 'A student quoted the Park Service page as if a French settler wrote it. Their teacher was not impressed.',
      },
      {
        type: 'stamp', doc: 'ch-cider', answer: 'primary',
        proof: ['ch-cider@by', 'ch-cider#all our drinks froze', 'ch-cider#We had to drink', 'ch-cider#we could not get to the shore', 'ch-cider#Most of us slept badly', 'ch-cider#I think that food'],
        near: CH_WHEN('ch-cider'),
        right: 'Primary. “We had to drink very bad water.” He lived through that winter.',
        wrong: 'This one is primary. Champlain spent that winter on the island and tells what happened to “us”.',
        consequence: 'The frozen-cider page was filed with the textbooks. It took a week to find.',
      },
      {
        type: 'stamp', doc: 'pc-colony', answer: 'secondary',
        proof: ['pc-colony@by', 'pc-colony@when'],
        near: { 'pc-colony#79': 'Numbers can come from anywhere. Who wrote this, and when?' },
        right: 'Secondary. Parks Canada wrote it in the 2020s, from the old records.',
        wrong: 'This one is secondary. Parks Canada wrote it between 2022 and 2024. They used older sources to do it.',
        consequence: 'A newspaper said Parks Canada “saw the colonists arrive”. Parks Canada did not exist in 1604.',
      },
      {
        type: 'stamp', doc: 'ch-map', answer: 'primary',
        proof: ['ch-map@by'],
        near: CH_WHEN('ch-map'),
        right: 'Primary. A map can be a primary source. Champlain drew the island he was living on.',
        wrong: 'This one is primary. Sources are not only writing. Champlain drew this map of the island he was living on.',
        consequence: 'Champlain’s map went to the “modern maps” drawer. A researcher spent a day looking for it.',
      },
      {
        type: 'stamp', doc: 'nps-winter', answer: 'secondary',
        proof: ['nps-winter@by', 'nps-winter@when'],
        near: { 'nps-winter#Of 79 men': 'The numbers are right, but they came from Champlain. Who wrote this page, and when?' },
        right: 'Secondary. Same story as Champlain’s pages, but told by the Park Service, in our time.',
        wrong: 'This one is secondary. It tells the same story as Champlain, but the Park Service wrote it in our time.',
        consequence: 'A slideshow listed the Park Service page as “an eyewitness account”. Oops.',
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: 'catalogue', title: 'Catalogue cards', short: 'Cards',
    letter: {
      from: HEAD,
      text: [
        'Good work. A stamp is only the start. Every document also gets a catalogue card: who made it, when, were they there, and who it was for.',
        'Fill the card with words from your notebook. Click a box on the card, then a word in your notebook. (You can drag them, too.)',
        'Notebook empty? The label at the top of each document has dotted words. Click them.',
      ],
    },
    tasks: [
      {
        type: 'catalogue', doc: 'ch-neighbours',
        fields: [
          { label: 'Made by', term: 'samuel-de-champlain' },
          { label: 'Year', term: '1613' },
          { label: 'Was the maker there?', choices: ['Yes', 'No'], answer: 0 },
          { label: 'Made for', choices: ['People who read his book', 'Visitors to a park today'], answer: 0 },
          { label: 'Stamp', choices: ['Primary', 'Secondary'], answer: 0 },
        ],
        right: 'A primary source. Keep this one in mind: Champlain calls these people’s winter “very miserable”. Is that a fact, or his opinion?',
      },
      {
        type: 'catalogue', doc: 'nps-history',
        fields: [
          { label: 'Made by', term: 'national-park-service' },
          { label: 'Year', term: '2021' },
          { label: 'Was the maker there?', choices: ['Yes', 'No'], answer: 1 },
          { label: 'Made for', choices: ['People who read his book', 'Visitors to a park today'], answer: 1 },
          { label: 'Stamp', choices: ['Primary', 'Secondary'], answer: 1 },
        ],
        right: 'A secondary source. It tells us something Champlain does not: the Passamaquoddy helped the French get healthy in the spring.',
      },
      {
        type: 'catalogue', doc: 'pc-winter',
        fields: [
          { label: 'Made by', term: 'parks-canada' },
          { label: 'Year', term: '2022' },
          { label: 'Was the maker there?', choices: ['Yes', 'No'], answer: 1 },
          { label: 'Made for', choices: ['People who read his book', 'Visitors to a park today'], answer: 1 },
          { label: 'Stamp', choices: ['Primary', 'Secondary'], answer: 1 },
        ],
        right: 'Secondary. But something about this page is odd. Read the last part again. We will come back to it.',
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'letter', title: 'A letter from the museum', short: 'Letter',
    letter: {
      from: 'J. Doucet, exhibit designer',
      text: [
        'Hello! I am building a museum display about the winter on Sainte-Croix, and I have four questions.',
        'Please answer each one, and point at the line in the sources that proves it. My visitors will ask how we know.',
      ],
    },
    tasks: [
      {
        type: 'question', docs: ['ch-cider', 'nps-winter'],
        ask: 'Why couldn’t the men get to the shore for firewood and fresh water?',
        options: ['Ice in the river made crossing impossible.', 'The Passamaquoddy kept them on the island.', 'Their ships had all gone back to France.', 'De Mons ordered everyone to stay inside.'],
        answer: 0,
        proof: ['ch-cider#we could not get to the shore', 'nps-winter#so nobody could cross'],
        near: { 'nps-winter#Cut off from the shore': 'That says they were cut off. Find the line that says WHAT cut them off.' },
        right: 'Ice. Two sources agree on it, a primary and a secondary. That makes it strong evidence.',
      },
      {
        type: 'question', docs: ['ch-cider', 'ch-scurvy'],
        ask: 'What did Champlain think was part of the cause of the sickness?',
        options: ['The salted food they ate all winter.', 'The cold wind through the cracks.', 'Drinking melted snow.', 'He had no idea at all.'],
        answer: 0,
        proof: ['ch-cider#I think that food'],
        near: {
          'ch-scurvy#We could not find any cure': 'That says they had no cure. But Champlain did have a guess about the cause. Look at his page about the frozen cider.',
          'ch-scurvy#change of season': 'That is about how they got better. What did he think made them sick?',
        },
        right: 'The salted food. He was close: today we know scurvy comes from going without fresh food.',
      },
      {
        type: 'question', docs: ['ch-neighbours'],
        ask: 'Champlain says the people here have a “very miserable” winter. What does his own description show?',
        options: ['They ate fresh meat and moved easily over the snow.', 'They were starving all winter.', 'They stayed in one place all winter.', 'They needed French bread to survive.'],
        answer: 0,
        proof: ['ch-neighbours#live mostly on that meat', 'ch-neighbours#walk on top of the snow', 'ch-neighbours#The animal sinks', 'ch-neighbours#they all feast'],
        near: { 'ch-neighbours#very miserable': 'That is his opinion. Find a line that shows how they really lived.' },
        right: 'Read like a historian. His opinion shows how the French saw the people here. His facts show families eating fresh meat all winter, while 35 of his own men died.',
      },
      {
        type: 'question', docs: ['ch-pr-winter', 'nps-portroyal'],
        ask: 'Port Royal, the next winter. Champlain and the Park Service give different numbers of men who died. Whose number has stronger evidence behind it?',
        options: ['Champlain’s. He was there and counted his own men.', 'The Park Service’s. Newer is always more correct.', 'The Park Service’s. It is a government website.', 'Neither. When sources disagree, both are useless.'],
        answer: 0,
        proof: ['ch-pr-winter#Of the 45 of us'],
        near: { 'nps-portroyal#five men died': 'That is the Park Service’s number. Find the line where the eyewitness gives his count.' },
        right: 'Champlain was at Port Royal and counted his own men: 12 of 45. The park page doesn’t say where its number comes from. A careful historian would look for more sources.',
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: 'twist', title: 'Same page, new question', short: 'Twist',
    letter: {
      from: HEAD,
      text: [
        'Here is the secret of this job. Primary or secondary is not only about the document. It depends on the QUESTION you are asking.',
        'Watch. The same web page is coming across your desk twice, with two different questions.',
      ],
    },
    tasks: [
      {
        type: 'stamp', doc: 'nps-passamaquoddy', question: 'How did the Passamaquoddy live in 1604?', answer: 'secondary',
        proof: ['nps-passamaquoddy@by', 'nps-passamaquoddy@when'],
        right: 'Secondary, as you would expect. The Park Service was not there in 1604.',
        wrong: 'For a question about 1604, this page is secondary. It was written in our time.',
        consequence: 'A report on 1604 listed a 2021 web page as its eyewitness.',
      },
      {
        type: 'stamp', doc: 'nps-passamaquoddy', question: 'How do parks TODAY tell the Passamaquoddy story?', answer: 'primary',
        proof: ['nps-passamaquoddy@by', 'nps-passamaquoddy@when', 'nps-passamaquoddy@what'],
        right: 'Primary! For this question, the page IS the evidence. It was made today, by a park, to tell the story. Same page, new question, new stamp.',
        wrong: 'Tricky! For this question the page itself is the evidence. It shows how a park tells the story today, so it is primary.',
        consequence: 'A researcher studying how parks talk about First Nations left this page out. It was the best thing they could have used.',
      },
      {
        type: 'point', doc: 'pc-winter',
        ask: 'This page is secondary. But a primary source is hiding inside it. Point at it.',
        proof: ['pc-winter#swore in an official paper'],
        near: { 'pc-winter#archaeologists studied': 'Close! The archaeologists’ own report would be primary. But this line is the park retelling it. Look for words copied from 1605.' },
        right: 'De Mons’s sworn statement, written in 1605 by the leader of the colony. A secondary source can quote a primary one. Historians go and find the original: this one is at the National Archives of Canada.',
      },
      {
        type: 'question', docs: ['ch-cider'],
        ask: 'The Champlain pages on your desk are in today’s words. The Archive wrote them in 2026. Is Champlain’s account still a primary source?',
        options: ['Yes. The words are new, but it is still Champlain telling what he saw.', 'No. It was written in 2026, so now it is secondary.', 'No. Only the French page from 1613 can be a source.', 'Yes, because anything about the 1600s is primary.'],
        answer: 0,
        proof: ['ch-cider@by', 'ch-cider@words'],
        right: 'Yes, it is still the eyewitness’s account. But every retelling makes choices: Champlain’s French calls the people here “sauvages”, and today’s words don’t. When exact words matter, historians read the original.',
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    id: 'board', title: 'The main panel', short: 'Panel',
    letter: {
      from: 'J. Doucet, exhibit designer',
      text: [
        'Thank you! Last job: the main panel of the display. It tells what went wrong on Sainte-Croix.',
        'Fill the blanks with words from your notebook. Every word has to come from a source. Missing a word? Open any filed document and click it.',
        'Press Check when you think it is right. I can tell you how many are wrong, but not which ones.',
      ],
    },
    tasks: [
      {
        type: 'board', title: 'What went wrong on Sainte-Croix?',
        lines: [
          'Of the {79} men who spent the winter on the island, {35} died.',
          'The sickness was {scurvy}. All winter they ate {salted meat}, with no fresh food.',
          '{Ice} in the river cut them off from {firewood} and {drinking water}.',
          'Spring came in {May}. The {Passamaquoddy} came back from their winter camps, and the sick got better.',
        ],
        right: 'The panel is done, and every word on it can be traced to a source. That is what a historian does.',
      },
    ],
  },
];

export const OUTRO = [
  'You stamped, catalogued, answered and proved. You also found out the big secret: primary or secondary depends on the question.',
  'Remember: primary does not mean true, and secondary does not mean false. Champlain was there, and he still got things wrong about his neighbours.',
];
