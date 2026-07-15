import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import RecipeDetail from "@/pages/RecipeDetail";
import Taboos from "@/pages/Taboos";

export default function App() {
  return (
    <Router>
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
