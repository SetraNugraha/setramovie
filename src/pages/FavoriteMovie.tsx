/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../components/Navbar"
import CardMovie from "../components/CardMovie"
import { useMovies } from "../hooks/useMovies"
import { useEffect } from "react"

export default function FavoriteMovie() {
  const { favoriteMovies, isLoading, getFavoriteMovies } = useMovies()

  useEffect(() => {
    getFavoriteMovies()
  }, [])

  const FavoriteMovieList = () => {
    return favoriteMovies.length === 0 ? (
      <p className="ml-6">You dont have favorite movies.</p>
    ) : (
      favoriteMovies.map((movie) => {
        return <CardMovie key={movie.id} movieId={movie.id} poster={movie.poster_path} title={movie.title} date={movie.release_date} vote={parseFloat(movie.vote_average.toFixed(1))} />
      })
    )
  }

  return (
    <>
      <section className="mx-[150px]">
        <Navbar />
      </section>

      <section className="mx-[150px]">
        {/* Header */}
        <div className="ml-5 text-3xl font-semibold tracking-wider my-5">
          <h1>Your Favorite Movie</h1>
        </div>

        {/* Card Movie */}
        <div className="grid grid-cols-3 gap-5">{isLoading ? <p className="ml-5 font-semibold text-xl">Loading Movies ...</p> : <FavoriteMovieList />}</div>
      </section>
    </>
  )
}
