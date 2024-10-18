/* eslint-disable react-hooks/exhaustive-deps */
import { FaHeart } from "react-icons/fa"
import { useMovies } from "../hooks/useMovies"
import { useEffect, useState } from "react"

interface CardMovieProps {
  movieId: number
  title: string
  date: string
  vote: number
  poster: string
}

export default function CardMovie({
  movieId,
  title,
  date,
  vote,
  poster,
}: CardMovieProps) {
  const imageULR = import.meta.env.VITE_BASEIMGURL
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const { user, handleActionFavorite, checkStatus } = useMovies()

  const FavoriteButton = async () => {
    const status = await checkStatus(movieId)
    const currentStatus = status
    const newStatus = !currentStatus
    await handleActionFavorite(movieId, newStatus)
    setIsFavorite(newStatus)

    alert(newStatus ? "Added to favorite" : "Removed from favorite")
  }

  useEffect(() => {
    if (!user.isAuth) {
      return
    }

    const checkInitializeStatus = async () => {
      try {
        const status = await checkStatus(movieId)
        setIsFavorite(status)
      } catch (error) {
        console.log("Error initialize favorite status: ", error)
      }
    }

    if (user.sessionId) {
      checkInitializeStatus()
    }
  }, [movieId, user.sessionId])

  return (
    <>
      <div className="card card-side mx-auto bg-base-300 shadow-xl w-[500px]">
        <figure>
          <img src={`${imageULR}/${poster}`} alt="Movie" className="max-h-[200px]" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Rating : {vote}</p>
          <p>Release Date : {date}</p>
          <div className="card-actions justify-end">
            {user.isAuth && (
              <button onClick={FavoriteButton}>
                <FaHeart size={22} color={isFavorite ? "red" : "white"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
