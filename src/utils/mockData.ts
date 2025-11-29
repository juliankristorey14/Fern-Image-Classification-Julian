import type { User, ScanResult, FernDetails, AdminPermissions } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    role: 'user',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@fernid.com',
    role: 'admin',
    createdAt: '2023-12-01T09:00:00Z'
  }
];

export const fernSpeciesData: Record<string, FernDetails> = {
  'boston-fern': {
    commonName: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    description: 'The Boston fern is a popular houseplant with gracefully arching fronds and delicate leaflets. It thrives in humid environments and is known for its air-purifying qualities.',
    habitat: 'Native to tropical regions, particularly in Central and South America. Grows naturally in humid forests and swamps.',
    careRequirements: 'Requires bright indirect light, high humidity (60-70%), consistent moisture in soil, and temperatures between 60-75°F. Mist regularly and keep soil evenly moist but not waterlogged.',
    funFacts: [
      'Can remove formaldehyde and xylene from indoor air',
      'Has been grown as an ornamental plant since the 1890s',
      'Can produce up to 50 fronds in ideal conditions',
      'Named after Boston, Massachusetts where it was first popularized'
    ]
  },
  'maidenhair-fern': {
    commonName: 'Maidenhair Fern',
    scientificName: 'Adiantum raddianum',
    description: 'Delicate and graceful fern with fan-shaped leaflets on thin black stems. Highly prized for its elegant appearance and lacy foliage.',
    habitat: 'Found in moist, shaded areas near streams and waterfalls in tropical and temperate regions worldwide.',
    careRequirements: 'Needs high humidity, consistently moist soil, indirect light, and protection from drafts. Water when top inch of soil feels dry. Prefers temperatures 60-75°F.',
    funFacts: [
      'The genus name "Adiantum" means "unwetted" because water beads up on its leaves',
      'Used in traditional medicine for respiratory ailments',
      'One of the most ancient fern species, dating back millions of years',
      'Extremely sensitive to chemicals in tap water - use filtered water'
    ]
  },
  'birds-nest-fern': {
    commonName: "Bird's Nest Fern",
    scientificName: 'Asplenium nidus',
    description: 'A striking tropical fern with glossy, apple-green fronds that emerge from a central rosette, resembling a bird\'s nest.',
    habitat: 'Native to tropical regions of Asia, Australia, and East Africa. Grows as an epiphyte on trees in rainforests.',
    careRequirements: 'Thrives in medium to bright indirect light, high humidity, and temperatures between 60-80°F. Water when top inch of soil is dry. Avoid getting water in the center rosette.',
    funFacts: [
      'Fronds can grow up to 5 feet long in ideal conditions',
      'New fronds emerge tightly coiled and gradually unfurl',
      'Does not produce the typical fern-like divided leaves',
      'Can be grown mounted on wood like orchids'
    ]
  },
  'staghorn-fern': {
    commonName: 'Staghorn Fern',
    scientificName: 'Platycerium bifurcatum',
    description: 'Unique epiphytic fern with two types of fronds: shield-shaped sterile fronds and antler-shaped fertile fronds.',
    habitat: 'Native to tropical and temperate regions of Australia, New Guinea, and Southeast Asia. Grows on trees in humid forests.',
    careRequirements: 'Needs bright indirect light, moderate to high humidity, and infrequent but thorough watering. Best mounted on wood or grown in hanging baskets.',
    funFacts: [
      'Can live for decades with proper care',
      'The shield fronds turn brown but should not be removed',
      'Produces spores on the tips of fertile fronds',
      'One of only 18 species in the Platycerium genus'
    ]
  },
  'asparagus-fern': {
    commonName: 'Asparagus Fern',
    scientificName: 'Asparagus aethiopicus',
    description: 'Despite its name, not a true fern but a member of the lily family. Features feathery, light green foliage with a cascading growth habit.',
    habitat: 'Native to South Africa. Grows in a variety of conditions from coastal to inland areas.',
    careRequirements: 'Tolerates a wide range of light conditions, prefers well-draining soil, and moderate watering. Can handle some drought once established.',
    funFacts: [
      'Not actually a fern, but a flowering plant in the Asparagaceae family',
      'Produces small white flowers and red berries',
      'Can become invasive in some regions',
      'The berries are toxic to humans and pets'
    ]
  }
};

export const mockScans: ScanResult[] = [
  {
    id: 'scan1',
    userId: '1',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400',
    isPlant: true,
    isFern: true,
    species: 'boston-fern',
    confidence: 0.96,
    timestamp: '2024-03-10T15:30:00Z',
    details: fernSpeciesData['boston-fern']
  },
  {
    id: 'scan2',
    userId: '1',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
    isPlant: true,
    isFern: true,
    species: 'maidenhair-fern',
    confidence: 0.89,
    timestamp: '2024-03-09T10:15:00Z',
    details: fernSpeciesData['maidenhair-fern']
  },
  {
    id: 'scan3',
    userId: '1',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400',
    isPlant: true,
    isFern: false,
    species: undefined,
    confidence: 0.92,
    timestamp: '2024-03-08T14:20:00Z'
  }
];

export const getUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  if (!user) return null;
  // In a real app, you'd verify the password hash
  return user;
};

export const getUserScans = (userId: string): ScanResult[] => {
  return mockScans.filter(scan => scan.userId === userId);
};

export const getScanById = (scanId: string): ScanResult | undefined => {
  return mockScans.find(scan => scan.id === scanId);
};

export const getAllUsers = (): User[] => {
  return mockUsers;
};

export const promoteUser = (userId: string, permissions: Partial<AdminPermissions> = {}): void => {
  const u = mockUsers.find(u => u.id === userId);
  if (u) {
    u.role = 'admin';
    u.adminPermissions = {
      manageUsers: permissions.manageUsers || false,
      manageContent: permissions.manageContent || false,
      viewAnalytics: permissions.viewAnalytics || false,
      systemSettings: permissions.systemSettings || false,
    };
  }
};

export const deleteUser = (userId: string): void => {
  const idx = mockUsers.findIndex(u => u.id === userId);
  if (idx !== -1) {
    mockUsers.splice(idx, 1);
  }
};

export const updateUserRole = (userId: string, role: 'admin' | 'user'): void => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].role = role;
  }
};

export const getAllScans = (): ScanResult[] => {
  return mockScans;
};

export const deleteScan = (scanId: string): void => {
  const index = mockScans.findIndex(s => s.id === scanId);
  if (index !== -1) {
    mockScans.splice(index, 1);
  }
};

export const deleteUserScans = (userId: string): void => {
  for (let i = mockScans.length - 1; i >= 0; i--) {
    if (mockScans[i].userId === userId) {
      mockScans.splice(i, 1);
    }
  }
};

export const simulateScan = (userId: string, imageUrl: string): ScanResult => {
  // Randomly select a fern species or determine it's not a fern
  const speciesKeys = Object.keys(fernSpeciesData);
  const isFern = Math.random() > 0.3; // 70% chance it's a fern
  const isPlant = isFern || Math.random() > 0.5; // If not fern, 50% chance it's still a plant
  
  let species: string | undefined;
  let details: FernDetails | undefined;
  let confidence: number;
  
  if (isFern) {
    species = speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
    details = fernSpeciesData[species];
    confidence = 0.85 + Math.random() * 0.14; // 0.85-0.99 for ferns
  } else if (isPlant) {
    confidence = 0.80 + Math.random() * 0.15; // 0.80-0.95 for plants
  } else {
    confidence = 0.70 + Math.random() * 0.20; // 0.70-0.90 for non-plants
  }
  
  const result: ScanResult = {
    id: `scan-${Date.now()}`,
    userId,
    image: imageUrl,
    isPlant,
    isFern,
    species,
    confidence,
    timestamp: new Date().toISOString(),
    details
  };
  
  // Store in localStorage for retrieval on results page
  localStorage.setItem('lastScanResult', JSON.stringify(result));
  
  // Add to mock scans array
  mockScans.unshift(result);
  
  return result;
};