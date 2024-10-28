import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const baseURL = import.meta.env.VITE_BASEURL
  // const token = import.meta.env.VITE_TOKEN
  const apiKey = import.meta.env.VITE_APIKEY
  const navigate = useNavigate()

  const data = localStorage.getItem("user")
  const user = data ? JSON.parse(data) : ""
  const username = user.username ? user.username : "Guest"

  const handleGuestToLogin = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleLogout = async () => {
    try {
      if (!user.sessionId) {
        console.log("Session not found")
        return
      }

      const response = await axios.delete(`${baseURL}/authentication/session`, {
        params: {
          session_id: user.sessionId,
          api_key: apiKey,
        },
      })
      if (response.status === 200) {
        alert("Logout success")
        localStorage.removeItem("user")
        window.location.reload()
      }

      return response
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="navbar bg-base-100">
        {/* Logo */}
        <div className="navbar-start">
          <Link to={"/"} className="btn btn-ghost text-xl">
            SetraMovie
          </Link>
        </div>

        {/* Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={"/"}>Now Playing</Link>
            </li>
            <li>
              <Link to={"/popular"}>Popular Movies</Link>
            </li>
            <li>
              <Link to={"/movies"}>All Movies</Link>
            </li>
          </ul>
        </div>

        {/* Profile */}
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Photo Profile" src="/assets/images/penguin.png" />
              </div>
            </div>

            {/* Children Profile */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">Hello, {username}</a>
              </li>

              {user.isAuth ? (
                <>
                  <li>
                    <Link to={"/favorite"}>Favorite Movie</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={handleGuestToLogin}>Login</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
