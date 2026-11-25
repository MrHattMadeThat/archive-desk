// Acadie 1: the winter on Sainte-Croix (St. Croix Island), 1604–05.
//
// Every passage comes from ../acadie/src/sources.js, which was checked against the sources on 2026-11-19 (see
// ../acadie/docs/SOURCES.md). The "today's words" bodies are Acadie's plain retellings with [[terms]] marked; the
// 1878 English, the 1613 French and the park quotes are copied unchanged. Don't add facts from memory: a new fact needs
// a source, written down in docs/SOURCES.md.
//
//   look   'old' (a printed book page) | 'web' (a web page) | 'map'
//   meta   the label a student reads first: by, when, what, words. These lines can be pointed at as proof.
//   body   today's words, paragraphs. Sentences are split automatically.
//   en/fr  Champlain: Otis's 1878 English and Laverdière's 1870 printing of the 1613 French.
//   quote  a park page's own words.
//   pages  scans of the 1613 book (McGill University Library, via the Internet Archive; public domain), with
//          `marks`: [top%, bottom%] bands that show where the passage is.

const IA = 'https://archive.org/details/McGillLibrary-rbsc_lande_00116_c2-19950';
const page = (name, label, marks = []) => ({ src: `sources/champlain-1613-${name}.webp`, label, marks });

const CHAMPLAIN = (what) => ({
  by: '[[Samuel de Champlain]], a mapmaker who sailed with de Mons in 1604',
  when: `Printed in [[Paris]] in [[1613]]`,
  what,
  words: 'Retold in today’s words by the Archive. Nothing added. His own words are in the tabs.',
});
const CHAMPLAIN_CREDIT = 'Page images: McGill University Library (Lande collection), via the Internet Archive. French: Laverdière, 1870. English: C. P. Otis, 1878. All public domain.';

const NPS = (what) => ({
  by: 'The U.S. [[National Park Service]]',
  when: 'A web page, [[2021]] or later',
  what,
  words: 'Shortened into simpler words by the Archive. The park’s own words are in the next tab.',
});
const NPS_CREDIT = 'U.S. National Park Service. Public domain (U.S. government).';

const PC = (what) => ({
  by: '[[Parks Canada]]',
  when: 'A web page, [[2022]] to 2024',
  what,
  words: 'Shortened into simpler words by the Archive. The park’s own words are in the next tab.',
});
const PC_CREDIT = '© Parks Canada. Quoted for classroom use.';

export const SOURCES = {
  // ------------------------------------------------------------------ Champlain, 1613 (primary)
  'ch-island': {
    title: 'Why the island?', look: 'old', folder: 'Book pages',
    meta: CHAMPLAIN('Pages 32 and 33 of his book about his voyages'),
    body: [
      'In the middle of the river we found an [[island]] with rocky sides all around. It was covered with fir, birch, maple and oak trees.',
      'It was easy to defend. The shore is 900 to 1,000 steps away on each side, so no ship could go up the river without passing under our [[cannon]].',
      'We also picked it because it was in the middle of the peoples who lived on this coast and inland, and we wanted to be in contact with them. We hoped to end their wars with each other, have them work for us one day, and make them Christians.',
      'De Mons named it [[Sainte-Croix]]: Holy Cross. Up the river, at the falls, the people who live here come to fish for five or six weeks at a time.',
    ],
    en: [
      'We found two islands: one very small near the western bank; and the other in the middle, having a circumference of perhaps eight or nine hundred paces, with rocky sides three or four fathoms high all around… The island is covered with firs, birches, maples, and oaks. It is by nature very well situated, except in one place, where for about forty paces it is lower than elsewhere: this, however, is easily fortified, the banks of the main land being distant on both sides some nine hundred to a thousand paces. Vessels could pass up the river only at the mercy of the cannon on this island, and we deemed the location the most advantageous, not only on account of its situation and good soil, but also on account of the intercourse which we proposed with the savages of these coasts and of the interior, as we should be in the midst of them. We hoped to pacify them in the course of time, and put an end to the wars which they carry on with one another, so as to derive service from them in future, and convert them to the Christian faith. This place was named by Sieur de Monts the Island of St. Croix.',
      '[Up the river, at the falls:] The savages come here sometimes five or six weeks during the fishing season.',
    ],
    fr: [
      'Nous y trouvasmes deux isles: l’une fort petite proche de la terre de l’ouest: & l’autre au milieu, qui peut avoir huict ou neuf cens pas de circuit, eslevée de tous costez de trois à quatre toises de rochers… L’isle est remplie de sapins, boulleaux, esrables & chesnes. De soy elle est en fort bonne situation, & n’y a qu’un costé où elle baisse d’environ 40 pas, qui est aisé à fortifier, les costes de la terre ferme en estans des deux costez esloignées de quelques neuf cens à mille pas. Il y a des vaisseaux qui ne pourroyent passer sur la riviere qu’à la mercy du canon d’icelle. Qui est le lieu que nous jugeâmes le meilleur: tant pour la situation, bon pays, que pour la communication que nous prétendions avec les sauvages de ces costes & du dedans des terres, estans au millieu d’eux: Lesquels avec le temps on esperoit pacifier, & amortir les guerres qu’ils ont les uns contre les autres, pour en tirer à l’advenir du service: & les réduire à la foy Chrestienne. Ce lieu est nommé par le sieur de Mons l’isle saincte Croix.',
      '[Up the river, at the falls:] Les sauvages s’y retirent quelquesfois cinq ou six sepmaines durant la pesche.',
    ],
    pages: [page('p32', 'Page 32', [[12, 75]]), page('p33', 'Page 33', [[9, 12.5], [68.5, 74]])],
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  'ch-map': {
    title: 'Champlain’s map of the island', look: 'map', folder: 'A map',
    meta: CHAMPLAIN('A fold-out map in his book, facing page 34'),
    body: [
      'The numbers in the water are depths, in fathoms (one fathom is about 1.6 m).',
      'A the houses. B gardens. C a little islet with a [[cannon]]. D a platform with cannon. E the [[cemetery]]. F the chapel. G rocks around the island. H a little islet.',
      'On the shores: I where de Mons began a water mill. L where they made charcoal. M gardens on the west shore. N gardens on the east shore. O a big, high mountain inland. P the river of the Etechemins, flowing around the island.',
    ],
    en: ['The figures indicate fathoms of water.', 'A. A plan of our habitation. B. Gardens. C. Little islet serving as a platform for cannon. D. Platform where cannon were placed. E. The Cemetery. F. The Chapel. G. Rocky shoals about the Island Sainte Croix. H. A little islet. I. Place where Sieur de Monts had a water-mill commenced. L. Place where we made our coal. M. Gardens on the western shore. N. Other gardens on the eastern shore. O. Very large and high mountain on the main land. P. River of the Etechemins flowing about the Island of St. Croix.'],
    fr: ['Les chifres montrent les brasses d’eau.', 'A Le plan de l’habitation. B Jardinages. C Petit islet servant de platte forme à mettre le canon. D Platte forme où on mettoit du canon. E Le cimetière. F La chappelle. G Basses de rochers autour de l’isle saincte Croix. H Un petit islet. I Le lieu où le sieur de Mons avoit fait commencer un moulin à eau. L Place où l’on faisoit le charbon. M Jardinages à la grande terre de l’Ouest. N Autres jardinages à la grande terre de l’Est. O Grande montaigne fort haute dans la terre. P Riviere des Etechemins passant au tour de l’isle saincte Croix.'],
    pages: [page('island-map', 'The map')],
    pageFirst: true,
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  'ch-cider': {
    title: 'Frozen cider, melted snow, and the ice', look: 'old', folder: 'Book pages',
    meta: CHAMPLAIN('Pages 55 and 56 of his book about his voyages'),
    body: [
      'That winter all our drinks froze except the [[Spanish wine]]. The [[cider]] was handed out by the pound, like cheese. The storehouse had no cellar, and the wind through the cracks was colder than the air outside.',
      'We had to drink very bad water and [[melted snow]]. There were no springs or streams on the island, and we could not get to the shore: the tide, which rises and falls about 5 m, pushed [[big pieces of ice|ice]] up and down the river.',
      'Grinding wheat in the hand mill wore us out. Most of us slept badly, we were short of [[firewood]] because of the ice, and we ate only [[salted meat]] and dried vegetables all winter. I think that food was part of the cause of the sickness.',
      'You can’t really know this country until you spend a winter in it. In summer it is lovely: woods, fine land, lots of fish. But there are [[six months of winter]] here.',
    ],
    en: [
      'During this winter, all our liquors froze, except the Spanish wine. Cider was dispensed by the pound. The cause of this loss was that there were no cellars to our storehouse, and that the air which entered by the cracks was sharper than that outside. We were obliged to use very bad water, and drink melted snow, as there were no springs nor brooks; for it was not possible to go to the main land in consequence of the great pieces of ice drifted by the tide, which varies three fathoms between low and high water.',
      'Work on the hand-mill was very fatiguing, since the most of us, having slept poorly, and suffering from insufficiency of fuel, which we could not obtain on account of the ice, had scarcely any strength, and also because we ate only salt meat and vegetables during the winter, which produce bad blood. The latter circumstance was, in my opinion, a partial cause of these dreadful maladies.',
      'It would be very difficult to ascertain the character of this region without spending a winter in it; for, on arriving here in summer, every thing is very agreeable, in consequence of the woods, fine country, and the many varieties of good fish which are found there. There are six months of winter in this country.',
    ],
    fr: [
      'Durant cet yver nos boissons gelèrent toutes, horsmis le vin d’Espagne. On donnoit le cidre à la livre. La cause de ceste parte fut qu’il n’y avoit point de caves au magazin: & que l’air qui entroit par des fentes y estoit plus aspre que celuy de dehors. Nous estions contraints d’user de tresmauvaises eaux, & boire de la nege fondue, pour n’avoir ny fontaines ny ruisseaux: car il n’estoit pas possible d’aller en la grand terre, à cause des grandes glaces que le flus & reflus charioit, qui est de trois brasses de basse & haute mer.',
      'Le travail du moulin à bras estoit fort pénible: d’autant que la plus part estans mal couchez, avec l’incommodité du chauffage que nous ne pouvions avoir à cause des glaces, n’avoient quasi point de force, & aussi qu’on ne mangeoit que chair salée & légumes durant l’yver, qui engendrent de mauvais sang: ce qui à mon opinion causoit en partie ces facheuses maladies.',
      'Il estoit mal-aisé de recognoistre ce pays sans y avoir yverné, car y arrivant en été tout y est fort aggreable, à cause des bois, beaux pays & bonnes pescheries de poisson de plusieurs sortes que nous y trouvasmes. Il y a six mois d’yver en ce pays.',
    ],
    pages: [page('p55', 'Page 55', [[20, 55], [60, 71]]), page('p56', 'Page 56', [[9, 19]])],
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  'ch-scurvy': {
    title: 'The sickness', look: 'old', folder: 'Book pages',
    meta: CHAMPLAIN('Pages 53 to 55 of his book about his voyages'),
    body: [
      'In the winter many of our men caught a sickness they called “mal de la terre”, the land sickness. Learned men later told me it is called [[scurvy]].',
      'Their teeth got so loose you could pull them out with your fingers. Their arms and legs hurt and swelled up hard, and they could not walk.',
      'Of the [[79]] of us, [[35]] died, and more than 20 others nearly died. We could not find any cure.',
      'The ones still sick got better in the spring, which comes here in [[May]]. We thought the change of season healed them, more than any medicine.',
    ],
    en: [
      'During the winter, many of our company were attacked by a certain malady called the mal de la terre; otherwise scurvy, as I have since heard from learned men… Their teeth became very loose, and could be pulled out with the fingers without its causing them pain… Afterwards, a violent pain seized their arms and legs, which remained swollen and very hard… and they could not walk…',
      '… So that out of seventy-nine, who composed our party, thirty-five died, and more than twenty were on the point of death… We were unable to find any remedy for these maladies…',
      'Those who continued sick were healed by spring, which commences in this country in May. That led us to believe that the change of season restored their health rather than the remedies prescribed.',
    ],
    fr: [
      'Durant l’yver il se mit une certaine maladie entre plusieurs de nos gens, appelée mal de la terre, autrement Scurbut, à ce que j’ay ouy dire depuis à des hommes doctes… Les dents ne leur tenoient presque point, & les pouvoit on arracher avec les doits sans leur faire douleur… Apres il leur prenoit une grande douleur de bras & de jambes, lesquelles leur demeurèrent grosses & fort dures… & ne peuvoient marcher…',
      '… de façon que de 79 que nous estions, il en moururent 35 & plus de 20. qui en furent bien prés… Nous ne pusmes trouver aucun remède pour la curation de ces maladies…',
      'Ceux qui y resterent malades furent guéris au printemps, lequel commence en ces pays là est en May. Cela nous fit croire que le changement de saison leur rendit plustost la santé que les remèdes qu’on leur avoit ordonnés.',
    ],
    pages: [page('p53', 'Page 53', [[15, 64]]), page('p54', 'Page 54', [[9, 17], [76, 82]]), page('p55', 'Page 55', [[8, 17]])],
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  'ch-neighbours': {
    title: 'How the people here lived through the winter', look: 'old', folder: 'Book pages',
    meta: CHAMPLAIN('Pages 56 and 57 of his book about his voyages'),
    body: [
      'Not many people live here. In winter, when the snow is deepest, they hunt [[moose]] and other animals, and live mostly on that meat. When they are not hunting, they eat [[clams]]. In winter they wear warm beaver and moose furs. The women make all the clothes.',
      'To hunt, they wear [[snowshoes]], twice as big as ours, and walk on top of the snow: women and children as well as men. They follow an animal’s tracks until they see it. The animal sinks into the deep snow, so the hunters can catch up with it. Then the women and children come, set up a shelter, and they all feast. Then they go looking for more. That is how they spend the winter.',
      'In March, some of them came to the island and shared their hunt with us, in exchange for [[bread]] and other things. Champlain ends: their way of living in winter seems “[[very miserable]]” to him.',
    ],
    en: [
      'The savages who dwell here are few in number. During the winter, in the deepest snows, they hunt elks and other animals, on which they live most of the time… When they do not hunt, they live on a shell-fish, called the cockle. They clothe themselves in winter with good furs of beaver and elk. The women make all the garments, but not so exactly but that you can see the flesh under the arm-pits, because they have not ingenuity enough to fit them better.',
      'When they go a hunting, they use a kind of snow-shoe twice as large as those hereabouts, which they attach to the soles of their feet, and walk thus over the snow without sinking in, the women and children as well as the men. They search for the track of animals, which, having found, they follow until they get sight of the creature, when they shoot at it with their bows… as the animals cannot walk on the snow without sinking in. Then the women and children come up, erect a hut, and they give themselves to feasting. Afterwards, they return in search of other animals, and thus they pass the winter.',
      'In the month of March following, some savages came and gave us a portion of their game in exchange for bread and other things which we gave them. This is the mode of life in winter of these people, which seems to me a very miserable one.',
    ],
    fr: [
      'Les sauvages qui y habitent sont en petite quantité. Durant l’yver au fort de neges ils vont chasser aux eslans & autres bestes: de quoy ils vivent la pluspart du temps… Lors qu’ils ne vont à la chasse ils vivent d’un coquillage qui s’appelle coque. Ils se vestent l’yver de bonnes fourrures de castors & d’eslans. Les femmes font tous les habits, mais non pas si proprement qu’on ne leur voye la chair au dessous des aisselles, pour n’avoir pas l’industrie de les mieux accommoder.',
      'Quand ils vont à la chasse ils prennent de certaines raquettes, deux fois aussi grandes que celles de pardeçà, qu’ils s’attachent soubs les pieds, & vont ainsi sur la neige sans enfoncer, aussi bien les femmes & enfans, que les hommes, lesquels cherchent la piste des animaux; puis l’ayant trouvée ils la suivent jusques à ce qu’ils apercoivent la beste: & lors ils tirent dessus avec leur arcs… d’autant que ces animaux ne peuvent aller sur les neges sans enfoncer dedans: Et lors les femmes & enfans y viennent, & là cabannent & se donnent curée: Apres ils retournent voir s’ils en trouveront d’autres, & passent ainsi l’yver.',
      'Au mois de Mars ensuivant il vint quelques sauvages qui nous firent part de leur chasse en leur donnant du pain & autres choses en eschange. Voila la façon de vivre en yver de ces gens là, qui me semble estre bien miserable.',
    ],
    pages: [page('p56', 'Page 56', [[20, 86]]), page('p57', 'Page 57', [[9, 40]])],
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  'ch-pr-winter': {
    title: 'The next winter, at Port Royal', look: 'old', folder: 'Book pages',
    meta: CHAMPLAIN('Page 101 of his book about his voyages'),
    body: [
      'Some of our men were sick with the land sickness again, but not as badly as on Sainte-Croix. Of the [[45]] of us, [[12]] died, and five were sick and got better in the spring.',
      'The snow started on December 20. The winter was not as harsh as the year before, and the snow was not as deep and did not last as long.',
    ],
    en: [
      'We found some of our company sick with the mal de la terre, but not so seriously as at the Island of St. Croix; although, out of our number of forty-five, twelve died, including the miner, and five were sick, who recovered the following spring.',
      '… On the 20th of December, it began to snow, and some ice passed along before our settlement. The winter was not so sharp as the year before, nor the snow so deep, or of so long duration.',
    ],
    fr: [
      'Nous trouvasmes de nos gens malades du mal de la terre, mais non si griefvement qu’en l’isle S. Croix, bien que de 45 que nous estions il en mourut 12 dont le mineur fut du nombre, & cinq malades, qui guérirent le printemps venant.',
      '… Le 20 Decembre il commença à neger: & passa quelques glaces par devant nostre habitation. L’yver ne fut si aspre qu’il avoit esté l’année d’auparavant, ny les neges si grandes, ny de si longue durée.',
    ],
    pages: [page('p101', 'Page 101', [[9, 27], [51, 62]])],
    credit: CHAMPLAIN_CREDIT, link: IA,
  },

  // ------------------------------------------------------------------ U.S. National Park Service (secondary)
  'nps-summer': {
    title: 'Settling in, summer 1604', look: 'web', folder: 'Web page',
    url: 'nps.gov/articles/000/saint-croix-island-settlement.htm',
    meta: NPS('An article for people who visit the park, “The Saint Croix Island Settlement”'),
    body: [
      'At the end of June 1604 the French reached [[Passamaquoddy Bay]] and found the island. It had lots of fish nearby and looked easy to defend.',
      'They cleared the island and part of the shore, and soon had a [[storehouse]], gardens, an oven, a [[hand mill]] and houses. Champlain went away for about three weeks to map the coast, and came back around the end of September.',
    ],
    quote: [
      'At the end of June, after exploring the mouth of the St. John River, the group arrived at Passamaquoddy Bay. Here they found an island situated inland near the confluence of three rivers. Blessed with an abundance of resources, especially herring and bass, and easily defended against possible attack, it seemed a promising site for a settlement.',
      'Following this, the men set to clearing the island and the adjacent mainland. Before long they had created a small hamlet with a storehouse, gardens, oven, hand mill for grinding wheat, and a cluster of dwellings. With work progressing well, Sieur De Mons sent Champlain off for three weeks to explore southward… Champlain returned to St. Croix Island around the end of September.',
    ],
    credit: NPS_CREDIT, link: 'https://www.nps.gov/articles/000/saint-croix-island-settlement.htm',
  },

  'nps-winter': {
    title: 'A terrible winter', look: 'web', folder: 'Web page',
    url: 'nps.gov/articles/000/saint-croix-island-settlement.htm',
    meta: NPS('An article for people who visit the park, “The Saint Croix Island Settlement”'),
    body: [
      'Winter came early and hard. [[Ice]] filled the river, so nobody could cross. Cut off from the shore, the men ran short of [[drinking water]] and [[firewood]]. The [[cider]] froze and was handed out by the pound. They drank [[Spanish wine]] and [[melted snow]].',
      'With no [[fresh fruit or vegetables]], they got [[scurvy]]. Of [[79]] men, [[35]] died and 20 more nearly died. Spring came in [[May]], and a supply ship arrived on June 15, 1605.',
    ],
    quote: [
      'Soon the snow began to fall and the early start of an unusually severe winter cut short the settlers’ preparations. Before long the river filled with treacherous ice cakes, making it impossible to cross. Cut off from the mainland, they began to suffer from a shortage of drinking water, firewood, and other hardships. The cider froze and had to be given out by the pound. The settlers were forced to drink Spanish wine and melted snow. Lacking fresh fruit and vegetables, the men fell prey to scurvy.',
      'Of the 79 men who had stayed at St. Croix for the winter, 35 died, and 20 more came close to the same fate… Spring came at last in May, and the health of the settlement was restored. On June 15, 1605, Pontgravé arrived with a ship loaded with supplies.',
    ],
    credit: NPS_CREDIT, link: 'https://www.nps.gov/articles/000/saint-croix-island-settlement.htm',
  },

  'nps-portroyal': {
    title: 'The move to Port Royal', look: 'web', folder: 'Web page',
    url: 'nps.gov/articles/000/saint-croix-island-settlement.htm',
    meta: NPS('An article for people who visit the park, “The Saint Croix Island Settlement”'),
    body: [
      'In August 1605 de Mons ordered the move. The men quickly took their buildings apart, loaded the ships and sailed to [[Port Royal]].',
      'The next winter was much milder. Scurvy came back, but this time [[five]] men died. Water and game were close by, and the [[Mi’kmaq]] who lived there came to trade fresh meat for French bread.',
    ],
    quote: [
      'Upon their return to St. Croix in early August, De Mons gave the order to move the settlement to Port Royal. Although the task of moving the colony before winter was daunting, the settlers quickly dismantled their buildings, loaded their ships, and set sail for their new home.',
      'The move to Port Royal went well. The settlers were blessed with a much milder winter than the one before, and although scurvy again proved a problem, this time the colony lost only five of its residents to the disease. Water and game were readily available, and the local Mi’kmaq came to the settlement to trade fresh meat for French bread.',
    ],
    credit: NPS_CREDIT, link: 'https://www.nps.gov/articles/000/saint-croix-island-settlement.htm',
  },

  'nps-passamaquoddy': {
    title: 'The Passamaquoddy and the island', look: 'web', folder: 'Web page',
    url: 'nps.gov/articles/000/saint-croix-island-historical-context.htm',
    meta: NPS('An article for people who visit the park, “Saint Croix Island: Historical Context”'),
    body: [
      'The island was already known and used by the Wabanaki peoples, who helped the French and taught them how to survive here. The Passamaquoddy name for it is thought to be [[Muttoneguis]].',
      'This was [[Passamaquoddy]] (Peskotomuhkati) homeland. They hunted [[seal]] and porpoise, fished, gathered roots and wild grapes, and made [[maple sugar]]. They lived in big villages in summer and small camps in winter, and made birch bark homes, canoes, snowshoes and toboggans.',
    ],
    quote: [
      'The island itself was already known and used by the Wapaponiyik (or Waponahki) First Peoples of the region who helped the French and taught them how to survive in the unfamiliar climate and territory… The original Passamaquoddy name is thought to be “Muttoneguis”.',
      'St. Croix Island itself, as well as its immediate surroundings, was home to the Passamaquoddy, or people of the Pollock. Sea mammal hunters and fishermen, they lived in small settlements during the winter and large villages in summer. Together they hunted for seals, porpoise, and fish, gathered roots and wild grapes, and made sugar from the maple trees along the shores of Passamaquoddy Bay. Passamaquoddy technology included birch bark homes, canoes, and containers, as well as the snowshoe and toboggan.',
    ],
    credit: NPS_CREDIT, link: 'https://www.nps.gov/articles/000/saint-croix-island-historical-context.htm',
  },

  'nps-history': {
    title: 'The Passamaquoddy year, and spring 1605', look: 'web', folder: 'Web page',
    url: 'nps.gov/sacr/learn/historyculture/index.htm',
    meta: NPS('A page for people who visit the park, “History & Culture”'),
    body: [
      'The [[Passamaquoddy]] moved with the seasons, to wherever the food was. Summers on the coast and the islands. In the cold, inland, hunting bigger animals.',
      'They traded [[furs]] to the French for hatchets, knives, [[glass beads]] and metal pots.',
      'In the spring of 1605 they came back from their [[winter camps]] to the shores around the island. With their help, the French who were still alive got healthier.',
    ],
    quote: [
      'The Passamaquoddy people roamed through the area in accordance with the seasons, dictated by the availability of food. Summers would be spent around the coasts and islands of the area… With the cold weather, they moved inland and hunted bigger game for food and other materials of value for living.',
      'The Frenchmen met the Passamaquoddy who supplied the furs the French sought in exchange for hatchets, knives, glass beads, metal cookware, and other goods.',
      'In the following spring of 1605, the Passamaquoddy returned from their winter sojourn to the shores of Saint Croix Island. With their help, the health of the remaining French improved.',
    ],
    credit: NPS_CREDIT, link: 'https://www.nps.gov/sacr/learn/historyculture/index.htm',
  },

  // ------------------------------------------------------------------ Parks Canada (secondary)
  'pc-colony': {
    title: 'Who spent the winter on the island', look: 'web', folder: 'Web page',
    url: 'parks.canada.ca/lhn-nhs/nb/stcroix/culture/colonie-colony',
    meta: PC('An article for people who visit the historic site, “A French Colony in Acadie”'),
    body: [
      'The [[79]] men who spent the winter were noblemen, craftsmen, labourers, a Catholic priest and a Protestant minister, surgeons and soldiers. They brought weapons, grain, tools, trade goods, and a few buildings made in France in pieces, ready to put together.',
    ],
    quote: ['Seventy-nine men, including noblemen, artisans, labourers, Catholic and Protestants clerics, surgeons and soldiers spent the winter of 1604-05 on Saint Croix Island. The French brought with them things they considered essential, such as weapons, grains, utensils, tools, trade goods, and a few prefabricated frame buildings.'],
    credit: PC_CREDIT, link: 'https://parks.canada.ca/lhn-nhs/nb/stcroix/culture/colonie-colony',
  },

  'pc-winter': {
    title: 'The graves on the island', look: 'web', folder: 'Web page',
    url: 'parks.canada.ca/lhn-nhs/nb/stcroix/culture/hiver-winter',
    meta: PC('An article for people who visit the historic site, “A Winter of Despair”'),
    body: [
      'In 1968–69 [[archaeologists]] studied [[23 graves]] on the island. The men were buried facing east, the Christian way at the time. They were between about 17 and 45 years old.',
      'In December 1605, de Mons swore in an official paper: “…on the last day of March 1605… René Noël, Sieur de Bourgioly… died on Saint Croix Island of [[scurvy]]… and was buried on the island the same day he died.” That paper is kept at the [[National Archives of Canada]].',
    ],
    quote: [
      'In 1968-69, archaeologists examined 23 burials on Saint Croix Island. The bodies were buried with the feet towards the east, as was the Christian burial practice at the time… Research in 1995 suggests that the deceased men ranged in age from about 17 to 45 years old.',
      'In December 1605, Sieur de Mons testified that: “…on the last day of March 1605… René Noël, Sieur de Bourgioly of Vitrey, Bretagne… died on Saint Croix Island of scurvy… and was buried on the island the same day he died.” (National Archives of Canada)',
    ],
    credit: PC_CREDIT, link: 'https://parks.canada.ca/lhn-nhs/nb/stcroix/culture/hiver-winter',
  },
};
