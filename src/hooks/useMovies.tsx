import axios from "axios"
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

  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movies[]>([])
  const [popularMovies, setPopularMovies] = useState<Movies[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<Movies[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getPopularMovies = async () => {
    setIsLoading(true)
    const maxMovies: number = 30
    let currentPage: number = 1
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
      throw error
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

      const response = await axios.get(
        `${baseURL}/account/${user.accountId}/favorite/movies`,
        {
          params: {
            api_key: apiKey,
            session_id: user.sessionId,
          },
        },
      )

      setFavoriteMovies(response.data.results)
      return response
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsLoading(false)
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

      if (!response.data.success) {
        alert("Some error happened")
      }

      if (favoriteStatus === false) {
        window.location.reload()
      }
      
      return response.data
    } catch (error) {
      console.log(error)
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
      throw error
    }
  }

  return {
    user,
    nowPlayingMovies,
    popularMovies,
    favoriteMovies,
    isLoading,
    getFavoriteMovies,
    getPopularMovies,
    getNowPlayingMovies,
    handleActionFavorite,
    checkStatus,
  }
}
