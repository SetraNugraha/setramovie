import axios, { AxiosError } from "axios"
import { useState } from "react"

interface Movies {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

export const useMovies = () => {
  const baseURL = import.meta.env.VITE_BASEURL
  const apiKey = import.meta.env.VITE_APIKEY

  const data = localStorage.getItem("user")
  const user = data ? JSON.parse(data) : ""

  const [upcomingMovies, setUpcomingMovies] = useState<Movies[]>([])
  const [allMovies, setAllMovies] = useState<Movies[]>([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movies[]>([])
  const [popularMovies, setPopularMovies] = useState<Movies[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<Movies[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getAllMovies = async () => {
    setIsLoading(true)
    const limit: number = 100
    let currPage: number = 45
    const arrMovies: Movies[] = []
    try {
      while (arrMovies.length < limit) {
        const response = await axios.get(`${baseURL}/movie/popular`, {
          params: {
            api_key: apiKey,
            page: currPage,
          },
        })

        const movies = response.data.results
        // [{}, {}, {}] => {}, {}, {}
        arrMovies.push(...movies)
        currPage++
      }

      setAllMovies(arrMovies)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getUpcomingMovies = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseURL}/movie/upcoming`, {
        params: {
          api_key: apiKey,
          page: 15,
        },
      })

      const movie = response.data.results
      const slicedMovie = movie.slice(0, 3)
      setUpcomingMovies(slicedMovie)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getNowPlayingMovies = async () => {
    const limit = 6
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseURL}/movie/now_playing`, {
        params: {
          api_key: apiKey,
        },
      })

      const movies = response.data.results
      const results = movies.slice(0, limit)
      setNowPlayingMovies(results)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPopularMovies = async () => {
    setIsLoading(true)
    const maxMovies: number = 30
    let currentPage: number = 32
    const allMovies: Movies[] = []

    try {
      while (allMovies.length < maxMovies) {
        const response = await axios.get(`${baseURL}/movie/popular`, {
          params: {
            api_key: apiKey,
            page: currentPage,
          },
        })

        const movies = response.data.results
        allMovies.push(...movies)
        currentPage++
      }

      const results = allMovies.slice(0, maxMovies)
      setPopularMovies(results)
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getFavoriteMovies = async () => {
    setIsLoading(true)
    try {
      if (user.accountId === null) {
        return false
      }

      const response = await axios.get(`${baseURL}/account/${user.sessionId}/favorite/movies`, {
        params: {
          api_key: apiKey,
          session_id: user.sessionId,
        },
      })

      setFavoriteMovies(response.data.results)
      return response
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const searchMovie = async (query: string) => {
    try {
      const response = await axios.get(`${baseURL}/search/movie`, {
        params: {
          api_key: apiKey,
          query: query,
        },
      })

      return response.data
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    }
  }

  const handleActionFavorite = async (movieId: number, favoriteStatus: boolean) => {
    try {
      if (user.accountId === null) {
        return false
      }

      const response = await axios.post(
        `${baseURL}/account/${user.accountId}/favorite`,
        {
          media_type: "movie",
          media_id: movieId,
          favorite: favoriteStatus,
        },
        {
          params: {
            api_key: apiKey,
            session_id: user.sessionId,
          },
        },
      )

      console.log(response.data)

      if (!response.data.success) {
        alert("Some error happened")
      }

      if (favoriteStatus === false) {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }

      return response.data.success
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    }
  }

  const checkStatus = async (movieId: number) => {
    try {
      const response = await axios.get(`${baseURL}/movie/${movieId}/account_states`, {
        params: {
          api_key: apiKey,
          session_id: user.sessionId,
        },
      })

      return response.data.favorite
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return alert("Sorry, an error occurred")
      }
    }
  }

  return {
    user,
    allMovies,
    nowPlayingMovies,
    upcomingMovies,
    popularMovies,
    favoriteMovies,
    isLoading,
    getAllMovies,
    getFavoriteMovies,
    getUpcomingMovies,
    getPopularMovies,
    getNowPlayingMovies,
    searchMovie,
    handleActionFavorite,
    checkStatus,
  }
}
