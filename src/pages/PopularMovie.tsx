/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../components/Navbar"
import CardMovie from "../components/CardMovie"
import { useEffect, useState } from "react"
import { useMovies } from "../hooks/useMovies"

export default function PopularMovie() {
  const { popularMovies, getPopularMovies, isLoading } = useMovies()
  const [limitVisibleMovies, setLimitVisibleMovies] = useState<number>(6)

  useEffect(() => {
    getPopularMovies()
  }, [])

  const handleLoadMore = () => {
    setLimitVisibleMovies((prevState) => prevState + 6)
  }

  const MovieList = () => {
    return popularMovies.slice(0, limitVisibleMovies).map((movie, index) => {
      return (
        <CardMovie
          key={index}
          movieId={movie.id}
          poster={movie.poster_path}
          title={movie.title}
          date={movie.release_date}
          vote={parseFloat(movie.vote_average.toFixed(1))}
        />
      )
    })
  }

  return (
    <>
      <section className="mx-[150px]">
        <Navbar />
      </section>

      <section className="mx-[150px]">
        {/* Header */}
        <div className="ml-5 text-3xl font-semibold tracking-wider my-5">
          <h1>Popular Movies</h1>
        </div>

        {/* Card Movie */}
        <div className="grid grid-cols-3 gap-5 my-5">
          {isLoading ? (
            <p className="ml-5 font-semibold text-xl">Loading Movies ...</p>
          ) : (
            <MovieList />
          )}
        </div>

        <div className="text-center my-10">
          {limitVisibleMovies < popularMovies.length && (
            <button onClick={handleLoadMore} className="btn btn-accent">
              Load More
            </button>
          )}
        </div>
      </section>
    </>
  )
}
