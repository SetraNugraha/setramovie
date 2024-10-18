import { useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
  const [sessionId, setSessionId] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const verifySessionId = () => {
      const data = localStorage.getItem("user")
      setSessionId(data ? JSON.parse(data) : "")
      setIsLoading(false)
    }

    verifySessionId()
  }, [])

  if (isLoading) {
    return (
      <div className="text-2xl text-center text-white font-semibold mt-10">
        <p>Loading ...</p>
      </div>
    )
  }

  return sessionId ? <Outlet /> : <Navigate to={"/login"} replace />
}
