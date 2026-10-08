export type { Language } from "../config";

export type RegionId = "kigali" | "western" | "northern" | "southern" | "eastern";
export type ActivityId =
  | "hiking"
  | "walking"
  | "swimming"
  | "running"
  | "photography"
  | "nature"
  | "cultural"
  | "adventure";
export type Difficulty = "easy" | "moderate" | "challenging";
export type DurationId = "half_day" | "one_day" | "one_two_days" | "two_days";
export type ImageTone = "hills" | "lake" | "forest" | "savanna" | "volcano" | "falls";

/** Starting points people can choose when estimating cost. */
export type Origin = "Kigali" | "Rubavu" | "Musanze" | "Mahoko" | "Other";
export type KnownOrigin = Exclude<Origin, "Other">;

export type CostRange = { min: number; max: number };

/** How a data point is backed: confirmed by Explore Rwanda / a source, or estimated. */
export type Confirmation = "verified" | "estimated";

export type EntryFee =
  | { kind: "amount"; amount: number; confirmation: Confirmation }
  | { kind: "none_known" }
  | { kind: "unconfirmed" };

export type OriginEstimate = {
  origin: KnownOrigin;
  distanceKm: number;
  travelMinutes: { min: number; max: number };
  transport: CostRange;
  food: CostRange;
  activities: CostRange;
};

export type Activity = { id: ActivityId; glyph: string };

export type Destination = {
  id: string;
  name: string;
  slug: string;
  region: RegionId;
  locationNote: string;
  tagline: string;
  description: string;
  activities: ActivityId[];
  difficulty: Difficulty;
  duration: DurationId;
  bestConditions: string;
  conditions: { summary: string; source: "community" | "estimated" };
  whatToDo: { title: string; text: string }[];
  whatToBring: string[];
  safetyNotes: string[];
  nearbyFood: string[];
  nearbyStay?: string[];
  entryFee: EntryFee;
  rating?: number;
  reviewCount?: number;
  estimates: OriginEstimate[];
  lastUpdated: string; // ISO date
  images: string[];
  imageTone: ImageTone;
};

export type TripStatus = "open" | "almost_full" | "full" | "closed" | "cancelled";
export type OrganizerType = "individual" | "company";

export type ScheduleItem = { time: string; title: string; detail?: string };

export type Trip = {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationSlug: string;
  title: string;
  activity: ActivityId;
  date: string; // ISO date
  startTime: string;
  returnTime: string;
  duration: DurationId;
  startingLocation: string;
  meetingPoint: string;
  transportation: string;
  entryIncluded: boolean;
  foodNote: string;
  organizerId: string;
  organizerName: string;
  organizerType: OrganizerType;
  verified: boolean;
  approved: boolean;
  capacity: number;
  availableSpaces: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  currency: string;
  status: TripStatus;
  rating?: number;
  reviewCount?: number;
  overview: string;
  schedule: ScheduleItem[];
  whatToBring: string[];
  safety: string[];
  requirements: string[];
  requiresId: boolean;
  imageTone: ImageTone;
};

export type CompletedExperience = {
  id: string;
  title: string;
  date: string;
  destinationName: string;
  participants: number;
};

export type Organizer = {
  id: string;
  name: string;
  type: OrganizerType;
  verified: boolean;
  bio: string;
  location: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  completedTrips: number;
  participantExperiences: number;
  specialities: ActivityId[];
  completed: CompletedExperience[];
};

export type ReviewTopic =
  | "family_friendly"
  | "difficulty"
  | "weather"
  | "accessibility"
  | "food"
  | "safety"
  | "photography"
  | "nature"
  | "value";

export type Review = {
  id: string;
  targetType: "destination" | "organizer";
  targetId: string;
  rating: number;
  title?: string;
  content: string;
  authorName?: string;
  verifiedParticipant?: boolean;
  createdAt: string;
  topics: ReviewTopic[];
  helpfulCount: number;
};

export type ReviewInput = {
  targetType: "destination" | "organizer";
  targetId: string;
  rating: number;
  content: string;
  topics: ReviewTopic[];
};

export type User = { fullName: string; phone: string; email?: string };
export type AccountDetails = User;
export type SavedType = "destination" | "trip";
export type SavedItem = { type: SavedType; id: string };

export type TripRegistrationInput = {
  tripId: string;
  idNumber?: string;
  emergencyName: string;
  emergencyPhone: string;
};
export type TripRegistrationResult = {
  tripId: string;
  reference: string;
  status: "pending_confirmation";
};

export type OrganizerRequest = {
  type: OrganizerType;
  location: string;
  experience: string;
  areas: string;
  groupSize: string;
  companyName?: string;
  companyInfo?: string;
  agreed: boolean;
};
export type OrganizerRequestResult = { reference: string; status: "pending_verification" };
