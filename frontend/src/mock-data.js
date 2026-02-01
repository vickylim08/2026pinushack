export const mockArtData = [
  {
    id: '1',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    description: 'A famous painting by the Dutch artist Vincent van Gogh.',
    imageUrl: 'https://picsum.photos/seed/starry/800/600',
    location: {
      name: 'Museum of Modern Art, New York',
      lat: 40.7614,
      lng: -73.9776
    },
    comments: [
      { user: 'ArtLover', text: 'A masterpiece!' },
      { user: 'Critic', text: 'Overrated.' },
    ],
  },
  {
    id: '2',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    description: 'A 1931 painting by artist Salvador Dalí, and one of his most recognizable works.',
    imageUrl: 'https://picsum.photos/seed/memory/800/600',
    location: {
      name: 'Museum of Modern Art, New York',
      lat: 40.7614,
      lng: -73.9776
    },
    comments: [
      { user: 'SurrealFan', text: 'Dalí was a genius.' },
    ],
  },
  {
    id: '3',
    title: 'The Mona Lisa',
    artist: 'Leonardo da Vinci',
    description: 'A half-length portrait painting by the Italian Renaissance artist Leonardo da Vinci.',
    imageUrl: 'https://picsum.photos/seed/monalisa/800/600',
    location: {
      name: 'Louvre Museum, Paris',
      lat: 48.8606,
      lng: 2.3376
    },
    comments: [],
  },
  {
    id: '4',
    title: 'The Scream',
    artist: 'Edvard Munch',
    description: 'A composition created by Norwegian Expressionist artist Edvard Munch in 1893.',
    imageUrl: 'https://picsum.photos/seed/scream/800/600',
    location: {
      name: 'National Museum, Oslo',
      lat: 59.9139,
      lng: 10.7276
    },
    comments: [
      { user: 'AnxiousArt', text: 'This speaks to me.' },
      { user: 'ArtStudent', text: 'Iconic use of color.' },
    ],
  },
];
