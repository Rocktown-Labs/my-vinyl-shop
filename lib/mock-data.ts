export interface Vinyl {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  condition: "new" | "mint" | "near-mint" | "very-good" | "good" | "fair";
  price: number;
  quantity?: number; // Added quantity field
  images: {
    frontCover: string;
    backCover: string;
    vinyl: string;
    sleeve?: string;
  };
  sellerId: string;
  description: string;
  pressInfo?: string;
  catalogNumber?: string;
  label?: string;
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  country: string;
  joinedDate: string;
  totalSales: number;
  rating: number;
  verified: boolean;
  genres: string[];
  shipsTo: string[];
}

export const mockSellers: Seller[] = [
  {
    id: "1",
    name: "Vinyl Vault",
    username: "@vinylvault",
    avatar: "/vinyl-record-store-logo.jpg",
    bio: "Curating rare and classic vinyl since 2015. Specializing in jazz, soul, and funk.",
    location: "Brooklyn, NY",
    country: "United States",
    joinedDate: "2015-03-10",
    totalSales: 1247,
    rating: 4.9,
    verified: true,
    genres: ["Jazz", "Soul", "Funk"],
    shipsTo: ["United States", "Canada", "United Kingdom"],
  },
  {
    id: "2",
    name: "Retro Grooves",
    username: "@retrogrooves",
    avatar: "/retro-music-logo.jpg",
    bio: "Your source for 70s and 80s classics. Quality guaranteed.",
    location: "Austin, TX",
    country: "United States",
    joinedDate: "2017-08-22",
    totalSales: 892,
    rating: 4.8,
    verified: true,
    genres: ["Rock", "Pop", "Disco"],
    shipsTo: ["Worldwide"],
  },
  {
    id: "3",
    name: "The Record Room",
    username: "@recordroom",
    avatar: "/record-shop-vintage.jpg",
    bio: "Indie, alternative, and underground finds. Always hunting for gems.",
    location: "Portland, OR",
    country: "United States",
    joinedDate: "2018-11-05",
    totalSales: 654,
    rating: 4.7,
    verified: false,
    genres: ["Indie", "Alternative", "Punk"],
    shipsTo: ["United States"],
  },
  {
    id: "4",
    name: "Classic Spins",
    username: "@classicspins",
    avatar: "/classic-vinyl-collection.jpg",
    bio: "Rock, blues, and country from the golden age of vinyl.",
    location: "Nashville, TN",
    country: "United States",
    joinedDate: "2016-05-15",
    totalSales: 1089,
    rating: 4.9,
    verified: true,
    genres: ["Rock", "Blues", "Country"],
    shipsTo: ["United States", "Canada"],
  },
  {
    id: "5",
    name: "Tokyo Beats",
    username: "@tokyobeats",
    avatar: "/japanese-record-store.jpg",
    bio: "Rare Japanese pressings and city pop rarities.",
    location: "Tokyo",
    country: "Japan",
    joinedDate: "2019-01-20",
    totalSales: 723,
    rating: 4.8,
    verified: true,
    genres: ["City Pop", "Jazz", "Electronic"],
    shipsTo: ["Worldwide"],
  },
  {
    id: "6",
    name: "Berlin Vinyl",
    username: "@berlinvinyl",
    avatar: "/berlin-electronic-music-store.jpg",
    bio: "Techno, house, and electronic music from the heart of Europe.",
    location: "Berlin",
    country: "Germany",
    joinedDate: "2016-09-12",
    totalSales: 1456,
    rating: 4.9,
    verified: true,
    genres: ["Electronic", "Techno", "House"],
    shipsTo: ["Worldwide"],
  },
  {
    id: "7",
    name: "London Grooves",
    username: "@londongrooves",
    avatar: "/uk-record-shop.jpg",
    bio: "British rock, punk, and new wave specialists since 2014.",
    location: "London",
    country: "United Kingdom",
    joinedDate: "2014-06-08",
    totalSales: 2134,
    rating: 4.9,
    verified: true,
    genres: ["Rock", "Punk", "New Wave"],
    shipsTo: ["Worldwide"],
  },
  {
    id: "8",
    name: "Aussie Vinyl Co",
    username: "@aussievinyl",
    avatar: "/australian-music-store.jpg",
    bio: "Australian indie and international imports down under.",
    location: "Melbourne",
    country: "Australia",
    joinedDate: "2020-03-15",
    totalSales: 312,
    rating: 4.6,
    verified: false,
    genres: ["Indie", "Rock", "Electronic"],
    shipsTo: ["Australia", "New Zealand", "United States"],
  },
];

export const mockVinyls: Vinyl[] = [
  {
    id: "1",
    title: "Kind of Blue",
    artist: "Miles Davis",
    year: 1959,
    genre: "Jazz",
    condition: "near-mint",
    price: 45.99,
    quantity: 3, // Added quantity
    images: {
      frontCover: "/miles-davis-kind-of-blue-inspired.png",
      backCover: "/vinyl-album-back-cover.jpg",
      vinyl: "/blue-vinyl-record.png",
    },
    sellerId: "1",
    description:
      "Original pressing. Cover shows minimal wear, vinyl is clean with no scratches.",
    pressInfo: "Original Columbia pressing",
    catalogNumber: "CL 1355",
    label: "Columbia",
  },
  {
    id: "2",
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    genre: "Rock",
    condition: "very-good",
    price: 65.0,
    quantity: 1,
    images: {
      frontCover: "/beatles-abbey-road-album-cover.jpg",
      backCover: "/beatles-album-back.jpg",
      vinyl: "/black-vinyl-record.png",
    },
    sellerId: "1",
    description:
      "1969 UK pressing. Some shelf wear on cover, vinyl plays beautifully.",
    pressInfo: "UK Apple Records pressing",
    catalogNumber: "PCS 7088",
    label: "Apple Records",
  },
  {
    id: "3",
    title: "Purple Rain",
    artist: "Prince and The Revolution",
    year: 1984,
    genre: "Pop",
    condition: "new",
    price: 32.99,
    quantity: 5, // Added quantity
    images: {
      frontCover: "/prince-purple-rain-album.jpg",
      backCover: "/purple-rain-back-cover.jpg",
      vinyl: "/purple-colored-vinyl.jpg",
    },
    sellerId: "2",
    description: "2024 reissue on purple vinyl. Sealed, never played.",
    pressInfo: "2024 Remaster",
    catalogNumber: "R1 25110",
    label: "Warner Records",
  },
  {
    id: "4",
    title: "What's Going On",
    artist: "Marvin Gaye",
    year: 1971,
    genre: "Soul",
    condition: "mint",
    price: 54.99,
    quantity: 2, // Added quantity
    images: {
      frontCover: "/marvin-gaye-whats-going-on.jpg",
      backCover: "/soul-album-back-cover.jpg",
      vinyl: "/black-vinyl-pristine.jpg",
    },
    sellerId: "1",
    description:
      "Mint condition original pressing. Stored properly, never played.",
    pressInfo: "Original Tamla pressing",
    catalogNumber: "TS 310",
    label: "Tamla",
  },
  {
    id: "5",
    title: "Rumours",
    artist: "Fleetwood Mac",
    year: 1977,
    genre: "Rock",
    condition: "near-mint",
    price: 38.5,
    quantity: 1, // Added quantity
    images: {
      frontCover: "/fleetwood-mac-rumours-album.jpg",
      backCover: "/rumours-back-cover.jpg",
      vinyl: "/placeholder.svg?height=500&width=500",
    },
    sellerId: "2",
    description: "1977 pressing in excellent condition. Minimal surface noise.",
    pressInfo: "Warner Bros. Records",
    catalogNumber: "BSK 3010",
    label: "Warner Bros.",
  },
  {
    id: "6",
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    genre: "Progressive Rock",
    condition: "very-good",
    price: 48.99,
    quantity: 3, // Added quantity
    images: {
      frontCover: "/pink-floyd-dark-side-moon.jpg",
      backCover: "/placeholder.svg?height=500&width=500",
      vinyl: "/placeholder.svg?height=500&width=500",
    },
    sellerId: "3",
    description: "Classic album in great shape. Some wear on gatefold cover.",
    pressInfo: "Harvest Records UK pressing",
    catalogNumber: "SHVL 804",
    label: "Harvest",
  },
  {
    id: "7",
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
    genre: "Pop",
    condition: "near-mint",
    price: 42.0,
    quantity: 4, // Added quantity
    images: {
      frontCover: "/placeholder.svg?height=500&width=500",
      backCover: "/placeholder.svg?height=500&width=500",
      vinyl: "/placeholder.svg?height=500&width=500",
    },
    sellerId: "4",
    description: "Original 1982 pressing. Cover and vinyl both near mint.",
    pressInfo: "Epic Records pressing",
    catalogNumber: "QE 38112",
    label: "Epic",
  },
  {
    id: "8",
    title: "A Love Supreme",
    artist: "John Coltrane",
    year: 1965,
    genre: "Jazz",
    condition: "very-good",
    price: 52.99,
    quantity: 2, // Added quantity
    images: {
      frontCover: "/placeholder.svg?height=500&width=500",
      backCover: "/placeholder.svg?height=500&width=500",
      vinyl: "/placeholder.svg?height=500&width=500",
    },
    sellerId: "1",
    description:
      "Classic spiritual jazz masterpiece. Original Impulse! pressing.",
    pressInfo: "Impulse! Records",
    catalogNumber: "A-77",
    label: "Impulse!",
  },
];

export const genres = [
  "All Genres",
  "Rock",
  "Jazz",
  "Electronic",
  "Hip-Hop",
  "Classical",
  "Soul/R&B",
  "Punk",
  "Metal",
  "Folk",
  "Country",
  "Blues",
  "Reggae",
  "World",
  "Soundtracks",
  "Other",
];

export const conditions = [
  "new",
  "mint",
  "near-mint",
  "very-good",
  "good",
  "fair",
];

export const years = Array.from({ length: 75 }, (_, i) => 2024 - i);

export const countries = [
  "All Countries",
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "Australia",
  "Canada",
  "France",
  "Netherlands",
  "Italy",
  "Spain",
];

export const sellerRatings = ["Any Rating", "4.5+", "4.0+", "3.5+"];

export interface FeedPost {
  id: string;
  sellerId: string;
  type: "new_listing" | "price_drop" | "restock" | "announcement";
  vinylId?: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "order" | "message" | "follow" | "like" | "price_drop" | "bid";
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  link?: string;
  avatar?: string;
}

export const mockFeedPosts: FeedPost[] = [
  {
    id: "fp1",
    sellerId: "1",
    type: "new_listing",
    vinylId: "1",
    content:
      "Just added a rare original pressing of Kind of Blue to my collection!",
    createdAt: "2024-12-20T10:30:00Z",
  },
  {
    id: "fp2",
    sellerId: "2",
    type: "price_drop",
    vinylId: "3",
    content: "Price drop alert! Purple Rain now 20% off for the holidays.",
    createdAt: "2024-12-19T15:45:00Z",
  },
  {
    id: "fp3",
    sellerId: "5",
    type: "restock",
    content:
      "Restocked some amazing Japanese city pop records. Check them out!",
    createdAt: "2024-12-18T09:00:00Z",
  },
  {
    id: "fp4",
    sellerId: "6",
    type: "announcement",
    content:
      "Heading to a record fair in Munich this weekend. Expect new techno and house arrivals next week!",
    createdAt: "2024-12-17T14:20:00Z",
  },
  {
    id: "fp5",
    sellerId: "7",
    type: "new_listing",
    vinylId: "6",
    content:
      "Found a pristine copy of Dark Side of the Moon at an estate sale. First pressing!",
    createdAt: "2024-12-16T11:00:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "Order Shipped",
    content: "Your order #12345 has been shipped and is on its way!",
    read: false,
    createdAt: "2024-12-20T10:30:00Z",
    link: "/dashboard/orders/12345",
  },
  {
    id: "n2",
    type: "message",
    title: "New Message",
    content: "Vinyl Vault sent you a message about your order",
    read: false,
    createdAt: "2024-12-19T15:45:00Z",
    link: "/dashboard/messages",
    avatar: "/vinyl-record-store-logo.jpg",
  },
  {
    id: "n3",
    type: "follow",
    title: "New Follower",
    content: "Retro Grooves started following you",
    read: true,
    createdAt: "2024-12-18T09:00:00Z",
    link: "/seller/2",
    avatar: "/retro-music-logo.jpg",
  },
  {
    id: "n4",
    type: "price_drop",
    title: "Price Drop",
    content: "Purple Rain in your wishlist is now 20% off!",
    read: true,
    createdAt: "2024-12-17T14:20:00Z",
    link: "/product/3",
  },
  {
    id: "n5",
    type: "bid",
    title: "Outbid Alert",
    content: "You've been outbid on Abbey Road. Current bid: $75",
    read: false,
    createdAt: "2024-12-16T11:00:00Z",
    link: "/product/2",
  },
];

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  type: "transaction" | "social";
  orderId?: string;
  vinylId?: string;
  lastMessage: Message;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user", "1"],
    type: "transaction",
    orderId: "12345",
    vinylId: "1",
    lastMessage: {
      id: "m1",
      senderId: "1",
      content:
        "Your order has been shipped! Here is the tracking number: 1Z999AA10123456784",
      createdAt: "2024-12-20T10:30:00Z",
      read: false,
    },
    messages: [
      {
        id: "m0",
        senderId: "user",
        content:
          "Hi! I just placed an order for Kind of Blue. When do you expect to ship it?",
        createdAt: "2024-12-19T14:00:00Z",
        read: true,
      },
      {
        id: "m1",
        senderId: "1",
        content:
          "Your order has been shipped! Here is the tracking number: 1Z999AA10123456784",
        createdAt: "2024-12-20T10:30:00Z",
        read: false,
      },
    ],
  },
  {
    id: "conv2",
    participants: ["user", "2"],
    type: "social",
    lastMessage: {
      id: "m3",
      senderId: "2",
      content:
        "Thanks for the follow! Let me know if you're looking for anything specific.",
      createdAt: "2024-12-18T16:45:00Z",
      read: true,
    },
    messages: [
      {
        id: "m2",
        senderId: "user",
        content: "Hey! Love your collection, especially the 80s stuff.",
        createdAt: "2024-12-18T15:30:00Z",
        read: true,
      },
      {
        id: "m3",
        senderId: "2",
        content:
          "Thanks for the follow! Let me know if you're looking for anything specific.",
        createdAt: "2024-12-18T16:45:00Z",
        read: true,
      },
    ],
  },
  {
    id: "conv3",
    participants: ["user", "5"],
    type: "transaction",
    vinylId: "4",
    lastMessage: {
      id: "m5",
      senderId: "5",
      content: "Yes, I can ship to the US. Shipping would be around $15.",
      createdAt: "2024-12-17T09:15:00Z",
      read: true,
    },
    messages: [
      {
        id: "m4",
        senderId: "user",
        content: "Hi! Do you ship to the United States?",
        createdAt: "2024-12-17T08:00:00Z",
        read: true,
      },
      {
        id: "m5",
        senderId: "5",
        content: "Yes, I can ship to the US. Shipping would be around $15.",
        createdAt: "2024-12-17T09:15:00Z",
        read: true,
      },
    ],
  },
];
