import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

const Home = lazy(() => import("./pages/Home/Home"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const Destinations = lazy(() => import("./pages/Destination/Destinations"));
const DestinationDetail = lazy(() => import("./pages/Destination/DestinationDetail"));
const Trips = lazy(() => import("./pages/Trips/Trips"));
const TripDetails = lazy(() => import("./pages/TripDetails/TripDetails"));
const TripRegister = lazy(() => import("./pages/TripDetails/TripRegister"));
const Organizers = lazy(() => import("./pages/Organizers/Organizers"));
const OrganizerProfile = lazy(() => import("./pages/Organizers/OrganizerProfile"));
const Become = lazy(() => import("./pages/Organizers/Become"));
const OrganizerRequest = lazy(() => import("./pages/Organizers/OrganizerRequest"));
const Saved = lazy(() => import("./pages/Saved/Saved"));
const About = lazy(() => import("./pages/About/About"));
const Placeholder = lazy(() => import("./pages/Placeholder/Placeholder"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:slug" element={<DestinationDetail />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="trips/:id/register" element={<TripRegister />} />
        <Route path="organizers" element={<Organizers />} />
        <Route path="organizers/:id" element={<OrganizerProfile />} />
        <Route path="organize" element={<Become />} />
        <Route path="organize/request" element={<OrganizerRequest />} />
        <Route path="saved" element={<Saved />} />
        <Route path="about" element={<About />} />
        {/* Reserved for future organizer dashboard and admin tools. */}
        <Route path="organizer/*" element={<Placeholder area="organizer" />} />
        <Route path="admin/*" element={<Placeholder area="admin" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
