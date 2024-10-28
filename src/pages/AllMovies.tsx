/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../components/Navbar"
import CardMovie from "../components/CardMovie"
import { useMovies } from "../hooks/useMovies"
import { useEffect, useState } from "react"

export default function AllMovies() {
  const { getAllMovies, allMovies, isLoading } = useMovies()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const moviesPerPage = 9

  const indexLastMovies: number = currentPage * moviesPerPage
  const indexFirstMovies: number = indexLastMovies - moviesPerPage
  const currMovies = allMovies.slice(indexFirstMovies, indexLastMovies)
  const isLastPage: boolean = currentPage === Math.ceil(allMovies.length / moviesPerPage)

  const handleNextPage = () => {
    setCurrentPage((prevState) => (isLastPage ? prevState : prevState + 1))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevState) => (prevState > 1 ? prevState - 1 : 1))
  }

  const RenderAllMovies = () => {
    return currMovies.map((movie) => {
      return <CardMovie key={movie.id} movieId={movie.id} poster={movie.poster_path} title={movie.title} date={movie.release_date} vote={parseFloat(movie.vote_average.toFixed(1))} />
    })
  }

  useEffect(() => {
    getAllMovies()
  }, [])

  return (
    <>
      <section className="mx-[150px]">
        <Navbar />
      </section>

      <section className="mx-[150px] relative">
        {/* Header */}
        <div className="ml-5 text-3xl font-semibold tracking-wider my-5">
          <h1>All Movies</h1>
        </div>

        {/* Card Movie */}
        <div className="grid grid-cols-3 gap-5">{isLoading ? <p>Loading ...</p> : <RenderAllMovies />}</div>

        {/* Button Pagination */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-ceter justify-center gap-x-5 ">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn btn-primary tracking-wider disabled:bg-slate-500 disabled:text-black">
            Prev
          </button>
          <p className="flex items-center px-7 bg-slate-500 rounded-lg text-white font-semibold text-xl">{currentPage}</p>
          <button onClick={handleNextPage} disabled={isLastPage} className="btn btn-primary tracking-wider disabled:bg-slate-500 disabled:text-black">
            Next
          </button>
        </div>
      </section>
    </>
  )
}
