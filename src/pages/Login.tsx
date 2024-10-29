import axios, { AxiosError } from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Login() {
  const baseURL = import.meta.env.VITE_BASEURL
  const apiKey = import.meta.env.VITE_APIKEY
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // GET Request Token
      const getRequestToken = await axios.get(`${baseURL}/authentication/token/new`, {
        params: {
          api_key: apiKey,
        },
      })

      // Login username & password
      const loginResponse = await axios.post(
        `${baseURL}/authentication/token/validate_with_login`,
        {
          username: formLogin.username,
          password: formLogin.password,
          request_token: getRequestToken.data.request_token,
        },
        {
          params: {
            api_key: apiKey,
          },
        },
      )

      // Create Session
      const newSessionResponse = await axios.post(
        `${baseURL}/authentication/session/new`,
        {
          request_token: loginResponse.data.request_token,
        },
        {
          params: {
            api_key: apiKey,
          },
        },
      )

      const getAccountId = await axios.get(`${baseURL}/account`, {
        params: {
          api_key: apiKey,
          session_id: newSessionResponse.data.session_id,
        },
      })

      const user = {
        isAuth: true,
        accountId: getAccountId.data.id,
        username: formLogin.username,
        sessionId: newSessionResponse.data.session_id,
      }
      toast.success(`Welcome, ${formLogin.username}`, {
        theme: "dark",
      })
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/")
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Incorrect username or password", {
          theme: "dark",
          position: 'top-center'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuest = async (): Promise<void> => {
    try {
      const response = await axios.get(`${baseURL}/authentication/guest_session/new?api_key=${apiKey}`)

      const user = {
        isAuth: false,
        accountId: null,
        username: "Guest",
        sessionId: response.data.guest_session_id,
      }

      localStorage.setItem("user", JSON.stringify(user))

      navigate("/")
      toast.success("Success login as Guest", {
        theme: "dark",
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="hero my-auto min-h-screen">
        {/* Card Form Login */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleLogin} className="card-body ring-2 rounded-xl">
            <h1 className="text-2xl font-semibold tracking-wider mb-3">SetraMovie Login</h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold tracking-wider">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered"
                required
                onChange={(e) =>
                  setFormLogin({
                    ...formLogin,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold tracking-wider">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
                onChange={(e) =>
                  setFormLogin({
                    ...formLogin,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-control mt-6 flex flex-col gap-y-3">
              {/* Auth Login */}
              <button disabled={isLoading} className="btn btn-primary disabled:bg-slate-300 disabled:text-slate-700 disabled:cursor-wait">
                {isLoading ? "Process Authentication ..." : "Login"}
              </button>

              {/* Guest */}
              <button type="button" onClick={handleGuest} disabled={isLoading} className="btn btn-accent">
                Login As Guest
              </button>
            </div>

            {/* Register */}
            <p className="text-sm text-center mt-2 tracking-wider">
              Register here
              <a href="https://www.themoviedb.org/signup" target="_blank" className="text-blue-500 ml-1 hover:underline">
                TMDB Official Website
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
