export const contact = {
  brand: "Werroza Ceramic",
  monogram: "WR CERAMIC",
  email: "werrozaceramic@gmail.com",
  phone: "+91 63515 52618",
  phoneSecondary: "+91 89059 14320",
  phones: [
    { number: "+91 63515 52618", wa: "916351552618" },
    { number: "+91 89059 14320", wa: "918905914320" },
  ],
  instagram: {
    handle: "werroza_ceramica",
    url: "https://www.instagram.com/werroza_ceramica/",
  },
  address: "Office No.14, First Floor, Masayakhi Chembar, Wankaner, Morbi-363621.",
};

export const tones = {
  white: "Whites & Greys",
  beige: "Creams & Beiges",
  decor: "Decor & Colour",
} as const;

export type Tone = keyof typeof tones;

export const colours = ["White", "Cream", "Beige", "Brown", "Grey", "Black", "Blue", "Green", "Pink"] as const;

export type Colour = (typeof colours)[number];

export const categories = {
  "marble-glossy": "Marble & Glossy",
  "decor-feature": "Decor & Feature Walls",
  "fullbody-natural": "Fullbody & Natural",
} as const;

export type Category = keyof typeof categories;

export const isCategory = (value: string): value is Category => value in categories;

export type Design = { name: string; tone: Tone; colour: Colour; random: boolean };

// Names and "04 Random" faces follow the Infinite Collection catalogue; tone and colour are our own grouping.
const rows: [name: string, tone: Tone, colour: Colour, random: boolean][] = [
  ["Frostline", "white", "White", true],
  ["Genesis Nord", "beige", "Pink", true],
  ["Genesis Roxx", "beige", "Cream", true],
  ["Gloob Beige Decore", "decor", "Beige", false],
  ["Gloob Black Decore", "decor", "Black", false],
  ["Gloob Blue Decore", "decor", "Blue", false],
  ["Gloob Decore", "decor", "Blue", false],
  ["Gloob Natural Decore", "decor", "Grey", false],
  ["Grevitas Nord", "beige", "Beige", true],
  ["Grevitas Roxx", "beige", "Cream", true],
  ["Herald Fine", "white", "White", true],
  ["Herald Ultra", "beige", "White", true],
  ["Iris Blue", "white", "White", true],
  ["Ivory Lace", "white", "White", true],
  ["Lasa Bianco", "white", "Grey", true],
  ["Lasa Brown", "beige", "Cream", true],
  ["Leaves Blue", "decor", "Blue", false],
  ["Leaves Brown", "decor", "Brown", false],
  ["Leaves Natural", "decor", "Green", false],
  ["Leni Flesh", "beige", "Beige", true],
  ["Leni Nord", "beige", "Cream", true],
  ["Linum Grey", "white", "Grey", false],
  ["Marbo Mix", "beige", "Brown", true],
  ["Marbo Mud", "white", "Grey", true],
  ["Marbo Roxx", "beige", "Beige", true],
  ["Massina Antique", "beige", "Grey", true],
  ["Massina Elite", "beige", "Beige", true],
  ["Mattone Real", "beige", "Cream", true],
  ["Mattone Roxx", "beige", "Cream", true],
  ["Melvin Flash", "beige", "Beige", true],
  ["Melvin Panda", "white", "Grey", true],
  ["Milky Drift", "white", "White", false],
  ["Moon Flower", "decor", "White", false],
  ["Nautic Mint", "white", "White", true],
  ["Nautic Mist", "white", "White", true],
  ["Nexa Forest End", "white", "White", true],
  ["Nimox White", "white", "White", true],
  ["Ola Nex", "white", "Grey", true],
  ["Ola Orex", "decor", "Blue", true],
  ["Ola Pure", "white", "Grey", true],
  ["Onyx Natural", "white", "White", true],
  ["Onyx Nord", "beige", "Cream", true],
  ["Opal Cloud", "white", "White", false],
  ["Opulence Bianco", "beige", "Cream", false],
];

export const designs: Design[] = rows.map(([name, tone, colour, random]) => ({ name, tone, colour, random }));

export const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");

// Designs the catalogue shows in a room photo; the rest fall back to the tile swatch.
export const withScene = new Set([
  "Genesis Nord", "Gloob Blue Decore", "Grevitas Roxx", "Iris Blue", "Leaves Brown", "Leni Flesh",
  "Marbo Roxx", "Mattone Real", "Melvin Panda", "Nimox White", "Ola Nex", "Onyx Natural",
]);

export const heroSlabs = [
  "Lasa Brown", "Marbo Mix", "Massina Elite", "Herald Fine", "Melvin Panda", "Ola Pure",
  "Frostline", "Leni Flesh", "Melvin Flash", "Ola Orex", "Nimox White", "Linum Grey",
];

export const icons = {
  spark: ["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "M6 6l2.5 2.5", "M15.5 15.5L18 18", "M18 6l-2.5 2.5", "M8.5 15.5L6 18"],
  sun: ["M12 8a4 4 0 100 8 4 4 0 000-8z", "M12 2v2", "M12 20v2", "M2 12h2", "M20 12h2", "M5 5l1.5 1.5", "M17.5 17.5L19 19", "M19 5l-1.5 1.5", "M6.5 17.5L5 19"],
  grip: ["M4 7l4 5-4 5", "M10 7l4 5-4 5", "M16 7l4 5-4 5"],
  flask: ["M9 3h6", "M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"],
  acid: ["M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z", "M9 14h6"],
  umbrella: ["M3 12a9 9 0 0118 0z", "M12 12v6a2 2 0 004 0"],
  cube: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M12 12l8-4.5", "M12 12v9", "M12 12L4 7.5"],
  shield: ["M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z", "M9 12l2 2 4-4"],
  heat: ["M10 14V5a2 2 0 014 0v9a4 4 0 11-4 0z", "M12 9v7"],
  fire: ["M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-10z"],
  frost: ["M12 2v20", "M3.3 7l17.4 10", "M3.3 17L20.7 7", "M9 4l3 2 3-2", "M9 20l3-2 3 2"],
  leaf: ["M5 19c0-9 5-14 14-14 0 9-5 14-14 14z", "M5 19l8-8"],
  building: ["M5 21V5l9-2v18", "M14 9h5v12", "M3 21h18", "M8 8h2", "M8 12h2", "M8 16h2"],
} as const;

export type IconName = keyof typeof icons;

export const features: [IconName, string][] = [
  ["spark", "Easy to maintain"],
  ["sun", "UV resistant"],
  ["grip", "Non-slip"],
  ["flask", "Resistant to chemicals"],
  ["acid", "Resistant to acids"],
  ["umbrella", "Waterproof"],
  ["cube", "Dimensional stability"],
  ["shield", "Prevents bacterial growth"],
  ["heat", "Heat resistant"],
  ["fire", "Fire resistant"],
  ["frost", "Frost resistant"],
  ["leaf", "Ecological"],
];

export const applications = ["Residence", "Shops", "Offices", "Airports", "Hotels", "Public places", "Malls"];

export const trustPoints: [IconName, string, string][] = [
  ["shield", "Hygienic surfaces", "Helps prevent bacterial growth and wipes clean with ease."],
  ["cube", "Dimensional stability", "Large 600 × 1200 mm tiles that hold their shape and size."],
  ["building", "Made for busy spaces", "Suited to shops, offices, airports, hotels, public places and malls."],
];
