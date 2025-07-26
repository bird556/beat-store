const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Top Down',
    artist: 'Payroll Giovanni',
    bpm: 93,
    key: 'A# Minor',
    dateAdded: 'May 31, 2025',
    duration: '3:22',
    price: 39.99,
    image:
      'https://livemixtapes.com/_next/image?url=https%3A%2F%2Fimages.livemixtapes.com%2Fartists%2Fnodj%2Fpayroll_giovanni_cardo-another_day_another_dollar%2Fcover.jpg&w=640&q=75',
    audioUrl: '/audio/[LARRY JUNE] Top Down [E Minor - 92bpm].mp3', // Direct public path reference
  },
  {
    id: '2',
    title: 'Concrete',
    artist: 'Payroll Giovanni',
    bpm: 93,
    key: 'C Minor',
    dateAdded: 'May 30, 2025',
    duration: '3:45',
    price: 39.99,
    image:
      'https://media.pitchfork.com/photos/5a5e4dbd74323c4101f8a3ae/1:1/w_800,h_800,c_limit/Big%20Bossin%20Vol%202.jpg',
    audioUrl: '/audio/Concrete.mp3', // Direct public path reference
  },
  {
    id: '3',
    title: 'Dreams & Nightmares',
    artist: 'Larry June',
    bpm: 85,
    key: 'F# Minor',
    dateAdded: 'May 29, 2025',
    duration: '4:12',
    price: 39.99,
    image:
      'https://images.squarespace-cdn.com/content/v1/55930d01e4b03b84d2cba5a3/1493747770620-Z77J1S86IORYGDTBGS4T/image-asset.jpeg',
    audioUrl: '/audio/iPhone-Trappin.mp3', // Direct public path reference
  },
  {
    id: '4',
    title: 'Pimp Anthem',
    artist: 'Larry June',
    bpm: 95,
    key: 'D Minor',
    dateAdded: 'May 28, 2025',
    duration: '3:33',
    price: 39.99,
    image:
      'https://i.pinimg.com/474x/35/1d/d7/351dd7683d91f4827e94cfea12792d8a.jpg',
    audioUrl: '/audio/Mortal-Kombat.mp3', // Direct public path reference
  },
  {
    id: '5',
    title: 'City Lights',
    artist: 'Larry June',
    bpm: 87,
    key: 'G Minor',
    dateAdded: 'May 27, 2025',
    duration: '3:56',
    price: 39.99,
    image:
      'https://i.pinimg.com/1200x/d4/bd/5c/d4bd5cc9eefe2ca4859d21345429bc90.jpg',
    audioUrl: '/audio/Palm-Trees.mp3', // Direct public path reference
  },
  // New Gunna Type Beats
  {
    id: '6',
    title: 'Drip Too Hard',
    artist: 'Gunna',
    bpm: 140,
    key: 'B Minor',
    dateAdded: 'May 26, 2025',
    duration: '3:45',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/7f/05/ae/7f05ae439f3695ca4626c2d104d48e67.jpg',
    audioUrl: '/audio/Boss-Up.mp3',
  },
  {
    id: '7',
    title: 'Skybox',
    artist: 'Gunna',
    bpm: 132,
    key: 'F Minor',
    dateAdded: 'May 25, 2025',
    duration: '3:30',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/2a/30/4a/2a304a25bfe340a79a3b740cea56e75c.jpg',
    audioUrl: '/audio/Skybox.mp3',
  },
  {
    id: '8',
    title: 'Top Floor',
    artist: 'Gunna',
    bpm: 128,
    key: 'G# Minor',
    dateAdded: 'May 24, 2025',
    duration: '3:15',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/ce/13/60/ce13604c3e03a5134b69784a0828931f.jpg',
    audioUrl: '/audio/Top-Floor.mp3',
  },
  {
    id: '9',
    title: 'Oh Okay',
    artist: 'Gunna',
    bpm: 136,
    key: 'D# Minor',
    dateAdded: 'May 23, 2025',
    duration: '3:50',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/51/3c/4c/513c4cd399c048438e80f39abfbbe38c.jpg',
    audioUrl: '/audio/Oh-Okay.mp3',
  },
  // New Key Glock Type Beats
  {
    id: '10',
    title: 'Russian Cream',
    artist: 'Key Glock',
    bpm: 150,
    key: 'A Minor',
    dateAdded: 'May 22, 2025',
    duration: '3:20',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/a2/3b/a7/a23ba7a9cdb5d504d7e847f6bcbada7b.jpg',
    audioUrl: '/audio/Russian-Cream.mp3',
  },
  {
    id: '11',
    title: 'Dough',
    artist: 'Key Glock',
    bpm: 145,
    key: 'E Minor',
    dateAdded: 'May 21, 2025',
    duration: '3:40',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/12/70/8d/12708d913170234f09abb706f33cb283.jpg',
    audioUrl: '/audio/Dough.mp3',
  },
  // New Drake Type Beat
  {
    id: '12',
    title: "God's Plan",
    artist: 'Drake',
    bpm: 138,
    key: 'C# Minor',
    dateAdded: 'May 20, 2025',
    duration: '3:18',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/b5/bb/d1/b5bbd16950dd94db59e4b543eb7e4d4c.jpg',
    audioUrl: '/audio/Gods-Plan.mp3',
  },
  // Additional tracks to reach 20 total
  {
    id: '13',
    title: 'Sicko Mode',
    artist: 'Drake',
    bpm: 142,
    key: 'B Minor',
    dateAdded: 'May 19, 2025',
    duration: '5:12',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/b5/bb/d1/b5bbd16950dd94db59e4b543eb7e4d4c.jpg',
    audioUrl: '/audio/Sicko-Mode.mp3',
  },
  {
    id: '14',
    title: 'Money Longer',
    artist: 'Key Glock',
    bpm: 148,
    key: 'F Minor',
    dateAdded: 'May 18, 2025',
    duration: '3:25',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/a2/3b/a7/a23ba7a9cdb5d504d7e847f6bcbada7b.jpg',
    audioUrl: '/audio/Money-Longer.mp3',
  },
  {
    id: '15',
    title: 'Lemonade',
    artist: 'Gunna',
    bpm: 134,
    key: 'G Minor',
    dateAdded: 'May 17, 2025',
    duration: '3:45',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/7f/05/ae/7f05ae439f3695ca4626c2d104d48e67.jpg',
    audioUrl: '/audio/Lemonade.mp3',
  },
  {
    id: '16',
    title: 'Numbers',
    artist: 'Key Glock',
    bpm: 152,
    key: 'D Minor',
    dateAdded: 'May 16, 2025',
    duration: '3:15',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/12/70/8d/12708d913170234f09abb706f33cb283.jpg',
    audioUrl: '/audio/Numbers.mp3',
  },
  {
    id: '17',
    title: 'Never Recover',
    artist: 'Gunna',
    bpm: 130,
    key: 'A# Minor',
    dateAdded: 'May 15, 2025',
    duration: '3:50',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/2a/30/4a/2a304a25bfe340a79a3b740cea56e75c.jpg',
    audioUrl: '/audio/Never-Recover.mp3',
  },
  {
    id: '18',
    title: 'Look Alive',
    artist: 'Drake',
    bpm: 136,
    key: 'E Minor',
    dateAdded: 'May 14, 2025',
    duration: '3:00',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/b5/bb/d1/b5bbd16950dd94db59e4b543eb7e4d4c.jpg',
    audioUrl: '/audio/Look-Alive.mp3',
  },
  {
    id: '19',
    title: 'Sold Out Dates',
    artist: 'Gunna',
    bpm: 132,
    key: 'F# Minor',
    dateAdded: 'May 13, 2025',
    duration: '3:55',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/ce/13/60/ce13604c3e03a5134b69784a0828931f.jpg',
    audioUrl: '/audio/Sold-Out-Dates.mp3',
  },
  {
    id: '20',
    title: 'One Call',
    artist: 'Key Glock',
    bpm: 146,
    key: 'C Minor',
    dateAdded: 'May 12, 2025',
    duration: '3:30',
    price: 39.99,
    image:
      'https://i.pinimg.com/736x/a2/3b/a7/a23ba7a9cdb5d504d7e847f6bcbada7b.jpg',
    audioUrl: '/audio/One-Call.mp3',
  },
];

export default sampleTracks;
