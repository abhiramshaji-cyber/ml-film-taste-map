export type Film = {
  id: string;
  title: string;
  year: number;
  taste: readonly [spectacle: number, dark: number, cerebral: number];
};

export const FILMS: readonly Film[] = [
  {
    id: "godfather",
    title: "The Godfather",
    year: 1972,
    taste: [-0.2, 0.8, 0.4],
  },
  {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    year: 1994,
    taste: [0.1, 0.6, 0.2],
  },
  {
    id: "dark-knight",
    title: "The Dark Knight",
    year: 2008,
    taste: [0.8, 0.8, 0.3],
  },
  { id: "inception", title: "Inception", year: 2010, taste: [0.8, 0.3, 0.8] },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    taste: [0.8, 0.1, 0.8],
  },
  { id: "matrix", title: "The Matrix", year: 1999, taste: [0.9, 0.4, 0.6] },
  {
    id: "spirited-away",
    title: "Spirited Away",
    year: 2001,
    taste: [0.3, -0.5, 0.4],
  },
  { id: "toy-story", title: "Toy Story", year: 1995, taste: [0.3, -0.9, -0.2] },
  {
    id: "finding-nemo",
    title: "Finding Nemo",
    year: 2003,
    taste: [0.3, -0.9, -0.4],
  },
  { id: "amelie", title: "Amélie", year: 2001, taste: [-0.6, -0.8, 0.2] },
  { id: "parasite", title: "Parasite", year: 2019, taste: [-0.3, 0.7, 0.6] },
  {
    id: "fury-road",
    title: "Mad Max: Fury Road",
    year: 2015,
    taste: [1, 0.5, -0.3],
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park",
    year: 1993,
    taste: [0.9, 0, -0.4],
  },
  { id: "titanic", title: "Titanic", year: 1997, taste: [0.6, 0.1, -0.6] },
  {
    id: "notebook",
    title: "The Notebook",
    year: 2004,
    taste: [-0.6, -0.4, -0.8],
  },
  { id: "la-la-land", title: "La La Land", year: 2016, taste: [-0.2, -0.5, 0] },
  { id: "mamma-mia", title: "Mamma Mia!", year: 2008, taste: [-0.1, -1, -0.9] },
  {
    id: "shawshank",
    title: "The Shawshank Redemption",
    year: 1994,
    taste: [-0.5, 0.4, 0.2],
  },
  { id: "fight-club", title: "Fight Club", year: 1999, taste: [0, 0.8, 0.5] },
  { id: "se7en", title: "Se7en", year: 1995, taste: [-0.1, 1, 0.3] },
  {
    id: "silence-lambs",
    title: "The Silence of the Lambs",
    year: 1991,
    taste: [-0.2, 0.9, 0.3],
  },
  {
    id: "space-odyssey",
    title: "2001: A Space Odyssey",
    year: 1968,
    taste: [0.3, 0.1, 1],
  },
  {
    id: "blade-runner",
    title: "Blade Runner",
    year: 1982,
    taste: [0.4, 0.5, 0.9],
  },
  { id: "arrival", title: "Arrival", year: 2016, taste: [0.2, 0.1, 0.9] },
  {
    id: "eternal-sunshine",
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    taste: [-0.7, 0.1, 0.8],
  },
  {
    id: "lost-translation",
    title: "Lost in Translation",
    year: 2003,
    taste: [-0.9, -0.1, 0.6],
  },
  { id: "moonlight", title: "Moonlight", year: 2016, taste: [-0.9, 0.3, 0.6] },
  {
    id: "grand-budapest",
    title: "The Grand Budapest Hotel",
    year: 2014,
    taste: [-0.4, -0.6, 0.4],
  },
  {
    id: "mean-girls",
    title: "Mean Girls",
    year: 2004,
    taste: [-0.3, -0.9, -0.8],
  },
  { id: "shrek", title: "Shrek", year: 2001, taste: [0.2, -1, -0.5] },
  {
    id: "endgame",
    title: "Avengers: Endgame",
    year: 2019,
    taste: [1, -0.2, -0.6],
  },
  { id: "star-wars", title: "Star Wars", year: 1977, taste: [0.9, -0.3, -0.3] },
  {
    id: "top-gun-maverick",
    title: "Top Gun: Maverick",
    year: 2022,
    taste: [1, -0.2, -0.7],
  },
  {
    id: "fellowship",
    title: "The Fellowship of the Ring",
    year: 2001,
    taste: [0.9, 0.2, 0],
  },
  { id: "get-out", title: "Get Out", year: 2017, taste: [-0.1, 0.8, 0.5] },
  { id: "whiplash", title: "Whiplash", year: 2014, taste: [-0.6, 0.5, 0.3] },
  { id: "casablanca", title: "Casablanca", year: 1942, taste: [-0.7, 0.1, 0] },
  {
    id: "groundhog-day",
    title: "Groundhog Day",
    year: 1993,
    taste: [-0.4, -0.7, 0.3],
  },
  { id: "alien", title: "Alien", year: 1979, taste: [0.5, 0.8, 0.3] },
  { id: "barbie", title: "Barbie", year: 2023, taste: [0.2, -0.8, 0] },
];
