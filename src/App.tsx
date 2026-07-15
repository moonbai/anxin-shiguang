import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import RecipeDetail from "@/pages/RecipeDetail";
import Taboos from "@/pages/Taboos";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/taboos" element={<Taboos />} />
        </Routes>
      </Layout>
    </Router>
  );
}
