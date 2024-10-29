/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../components/Navbar"
import CardMovie from "../components/CardMovie"
import { useMovies } from "../hooks/useMovies"
import { useEffect, useState } from "react"

export default function AllMovies() {
  const { getAllMovies, searchMovie, allMovies, isLoading } = useMovies()
  const [searchedMovie, setSearchedMovie] = useState([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>("")
  const moviesPerPage = 9

  const indexLastMovies: number = currentPage * moviesPerPage
  const indexFirstMovies: number = indexLastMovies - moviesPerPage
  const currMovies = (searchedMovie.length > 0 ? searchedMovie : allMovies).slice(indexFirstMovies, indexLastMovies)
  const isLastPage: boolean = currentPage === Math.ceil((searchedMovie.length > 0 ? searchedMovie.length : allMovies.length) / moviesPerPage)

  const handleNextPage = () => {
    setCurrentPage((prevState) => (isLastPage ? prevState : prevState + 1))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevState) => (prevState > 1 ? prevState - 1 : 1))
  }

  const handleSearchMovie = async () => {
    const response = await searchMovie(searchInput)
    setSearchedMovie(response.results)
    setCurrentPage(1)
  }

  const RenderAllMovies = () => {
    return currMovies.map((movie, index) => {
      return <CardMovie key={index} movieId={movie.id} poster={movie.poster_path} title={movie.title} date={movie.release_date} vote={parseFloat(movie.vote_average.toFixed(1))} />
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
        <div className="mx-5 text-3xl font-semibold tracking-wider my-5 flex items-center justify-between">
          <h1>All Movies</h1>

          {/* Search Button */}
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} />
            <button onClick={handleSearchMovie}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </label>
        </div>

        {/* Card Movie */}
        <div className="grid grid-cols-3 gap-5">{isLoading ? <p>Loading ...</p> : <RenderAllMovies />}</div>

        {/* Button Pagination */}

        <div className="join fixed bottom-5 left-1/2 -translate-x-1/2">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="join-item btn">
            «
          </button>
          <button className="join-item btn">Page {currentPage}</button>
          <button onClick={handleNextPage} disabled={isLastPage} className="join-item btn">
            »
          </button>
        </div>
      </section>
    </>
  )
}
