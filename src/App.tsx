import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import NowPlaying from "./pages/NowPlaying"
import PopularMovie from "./pages/PopularMovie"
import FavoriteMovie from "./pages/FavoriteMovie"
import PrivateRoute from "./pages/PrivateRoute"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path={"/"} element={<NowPlaying />} />
          <Route path={"/popular"} element={<PopularMovie />} />
          <Route path={"/favorite"} element={<FavoriteMovie />} />
        </Route>
      </Routes>
    </Router>
  )
}
