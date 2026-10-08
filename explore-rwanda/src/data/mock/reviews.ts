import type { Review } from "../../types";

// Illustrative sample experiences. Ranking is done by the service.
export const reviews: Review[] = [
  //  Ibere rya Bigogwe
  { id: "r1", targetType: "destination", targetId: "d-bigogwe", rating: 5, title: "Worth the early start", content: "Beautiful place to learn about nature and take photos. The meadows are wide and quiet, and the walking is gentle enough for beginners.", authorName: "Diane", verifiedParticipant: true, createdAt: "2026-09-13", topics: ["photography", "nature", "family_friendly"], helpfulCount: 14 },
  { id: "r2", targetType: "destination", targetId: "d-bigogwe", rating: 4, content: "Mornings are misty and cold, so bring a proper layer. By noon the views opened up completely.", authorName: "Samuel", verifiedParticipant: true, createdAt: "2026-08-30", topics: ["weather", "photography"], helpfulCount: 11 },
  { id: "r3", targetType: "destination", targetId: "d-bigogwe", rating: 5, content: "Got there from Mahoko by shared transport for a few thousand francs. Cheap, easy day out.", authorName: "Olivier", createdAt: "2026-09-21", topics: ["value"], helpfulCount: 9 },
  { id: "r4", targetType: "destination", targetId: "d-bigogwe", rating: 3, content: "Not much shade and no facilities. Carry your own water and food.", createdAt: "2026-07-14", topics: ["accessibility", "food"], helpfulCount: 4 },

  //  Nyandungu
  { id: "r5", targetType: "destination", targetId: "d-nyandungu", rating: 5, content: "Perfect for a quick morning walk without leaving the city. The boardwalks are easy for families and older relatives.", authorName: "Aline", verifiedParticipant: true, createdAt: "2026-09-27", topics: ["family_friendly", "accessibility"], helpfulCount: 12 },
  { id: "r6", targetType: "destination", targetId: "d-nyandungu", rating: 4, content: "Trails get muddy after rain. Otherwise great for running.", authorName: "Eric", createdAt: "2026-08-19", topics: ["weather"], helpfulCount: 5 },

  //  Lake Kivu
  { id: "r7", targetType: "destination", targetId: "d-kivu", rating: 5, content: "Calm water and friendly beaches. Swim in the marked areas and you'll be fine; sunsets are the best part.", authorName: "Chantal", verifiedParticipant: true, createdAt: "2026-09-21", topics: ["safety", "photography"], helpfulCount: 18 },
  { id: "r8", targetType: "destination", targetId: "d-kivu", rating: 4, content: "Food by the lake is good but prices vary a lot. Ask before you order.", authorName: "Patrick", createdAt: "2026-08-02", topics: ["food", "value"], helpfulCount: 8 },
  { id: "r9", targetType: "destination", targetId: "d-kivu", rating: 5, content: "Easy trip from Rubavu for almost nothing. Great for a lazy Sunday.", createdAt: "2026-09-06", topics: ["value"], helpfulCount: 6 },

  //  Nyungwe
  { id: "r10", targetType: "destination", targetId: "d-nyungwe", rating: 5, content: "The canopy walk is unforgettable, but the trails are steep and slippery. Proper boots made all the difference.", authorName: "Beatrice", verifiedParticipant: true, createdAt: "2026-07-19", topics: ["difficulty", "safety", "nature"], helpfulCount: 16 },
  { id: "r11", targetType: "destination", targetId: "d-nyungwe", rating: 4, content: "Bring rain gear even in the dry season. It was cold and misty in the morning.", authorName: "Jean", createdAt: "2026-06-28", topics: ["weather"], helpfulCount: 7 },

  //  Akagera
  { id: "r12", targetType: "destination", targetId: "d-akagera", rating: 5, content: "Saw giraffes and hippos in one day. Go early — the animals are most active at sunrise.", authorName: "Josiane", verifiedParticipant: true, createdAt: "2026-08-23", topics: ["nature", "photography"], helpfulCount: 15 },
  { id: "r13", targetType: "destination", targetId: "d-akagera", rating: 4, content: "A long day from Kigali. Worth it, but plan for a full day of travel.", authorName: "Emmanuel", createdAt: "2026-07-05", topics: ["value"], helpfulCount: 6 },

  //  Musanze
  { id: "r14", targetType: "destination", targetId: "d-musanze", rating: 4, content: "The caves are impressive and the guides explain the history well. Wear shoes with grip.", authorName: "Solange", verifiedParticipant: true, createdAt: "2026-08-09", topics: ["safety", "family_friendly"], helpfulCount: 7 },

  //  Bisoke
  { id: "r15", targetType: "destination", targetId: "d-bisoke", rating: 5, content: "Hard, muddy and absolutely worth it. The lake in the crater is stunning when the clouds clear.", authorName: "Aline", verifiedParticipant: true, createdAt: "2026-09-06", topics: ["difficulty", "photography"], helpfulCount: 13 },
  { id: "r16", targetType: "destination", targetId: "d-bisoke", rating: 3, content: "The route was difficult after heavy rain. Hiking poles and gloves are a must.", authorName: "Fabrice", createdAt: "2026-08-14", topics: ["difficulty", "weather", "safety"], helpfulCount: 10 },

  //  Organizers
  { id: "r17", targetType: "organizer", targetId: "o-rat", rating: 5, content: "Well organized from the briefing to the return. Guides were patient and the group size was just right.", authorName: "Josiane", verifiedParticipant: true, createdAt: "2026-08-24", topics: ["safety"], helpfulCount: 12 },
  { id: "r18", targetType: "organizer", targetId: "o-rat", rating: 4, content: "Clear costs up front and they confirmed everything by phone the day before.", authorName: "Emmanuel", verifiedParticipant: true, createdAt: "2026-07-20", topics: ["value"], helpfulCount: 8 },
  { id: "r19", targetType: "organizer", targetId: "o-jc", rating: 5, content: "Jean Claude kept the pace gentle and checked on everyone. Great for beginners.", authorName: "Diane", verifiedParticipant: true, createdAt: "2026-09-13", topics: ["family_friendly", "safety"], helpfulCount: 10 },
  { id: "r20", targetType: "organizer", targetId: "o-jc", rating: 4, content: "Started a little late but communicated clearly.", authorName: "Samuel", verifiedParticipant: true, createdAt: "2026-08-09", topics: [], helpfulCount: 3 },
  { id: "r21", targetType: "organizer", targetId: "o-aline", rating: 5, content: "Very safety-conscious on a difficult climb. Turned the group around exactly when she should have.", authorName: "Fabrice", verifiedParticipant: true, createdAt: "2026-09-06", topics: ["safety", "difficulty"], helpfulCount: 11 },
  { id: "r22", targetType: "organizer", targetId: "o-claudine", rating: 5, content: "Affordable and friendly, and the shared transport from Mahoko made it easy.", authorName: "Olivier", verifiedParticipant: true, createdAt: "2026-09-21", topics: ["value"], helpfulCount: 9 },
];
