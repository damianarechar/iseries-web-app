import React, { useState, useEffect } from 'react'
import './Content.css'
import SortingGroup from '../components/SortingGroup'
import FilteringGroup from '../components/FilteringGroup'
import Table from '../components/Table'
import SerieDetails from '../pages/SerieDetails'

function Content() {
  const [orderBy, setOrderBy] = useState('')
  const [filterBy, setFilterBy] = useState('popular')
  const [seriesList, setSeriesList] = useState([])
  const [goToDetails, setGoToDetails] = useState(false)
  const [favoritedSeriesList, setFavoritedSeriesList] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (id) {
      setGoToDetails(true)
    }
  })

  useEffect(() => {
    fetchApiDataForSeriesList()
  }, [seriesList === null])

  useEffect(() => {
    const sortedSeriesList = [...seriesList].sort((a, b) => {
      if (orderBy === 'Z-A') {
        if (a.name > b.name) return -1
      }
      if (orderBy === 'A-Z') {
        if (a.name < b.name) return -1
      }
      if (orderBy === '0-100') {
        if (a.vote_average < b.vote_average) return -1
      }
      if (orderBy === '100-0') {
        if (a.vote_average > b.vote_average) return -1
      }
      return 1
    })
    setSeriesList(sortedSeriesList)
  }, [orderBy])

  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    } else {
      fetchApiDataForSeriesList()
    }
  }, [filterBy])

  useEffect(() => {
    fetchApiDataForSeriesList()
  }, [page])

  useEffect(() => {
    if (favoritedSeriesList.length > 0) {
      localStorage.setItem(
        'favoritedSeriesList',
        JSON.stringify(favoritedSeriesList)
      )
    }
  }, [favoritedSeriesList])

  useEffect(() => {
    window.onpopstate = (e) => {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('id')

      if (id) {
        setGoToDetails(true)
      }
    }
  })

  useEffect(() => {
    if (
      !!localStorage.getItem('favoritedSeriesList') &&
      favoritedSeriesList.length === 0
    ) {
      if (favoritedSeriesList.length === 0) {
        setFavoritedSeriesList([
          ...JSON.parse(localStorage.getItem('favoritedSeriesList')),
        ])
      }
    }
  }, [favoritedSeriesList.length === 0])

  function handleOnClickOrderBy(event) {
    console.log(event.target.value)
    setOrderBy(event.target.value)
  }

  function handleOnClickFilterBy(event) {
    setFilterBy(event.target.value)
  }

  function handleOnClickSerie(serie) {
    const params = new URLSearchParams(window.location.search)
    params.set('id', serie.id)
    window.history.pushState(
      {},
      '',
      `${window.location.origin}/serie/?${params}`
    )
    setGoToDetails(true)
  }

  function handleOnClickIsFavorited(serie) {
    const alreadyAdded = favoritedSeriesList.find((fs) => {
      return serie.id === fs.id
    })
    if (!alreadyAdded) {
      setFavoritedSeriesList([...favoritedSeriesList, serie])
    }
  }

  function handleOnClickIsNotFavorited(serie) {
    let _favoritedSeriesList = favoritedSeriesList
    const serieToRemoveIndex = favoritedSeriesList.findIndex((fs) => {
      return serie.id === fs.id
    })
    _favoritedSeriesList.splice(serieToRemoveIndex, 1)
    setFavoritedSeriesList([..._favoritedSeriesList])
  }

  function fetchApiDataForSeriesList() {
    fetch(`${process.env.REACT_APP_API}tv/${filterBy}?page=${page}`, {
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer ' + process.env.REACT_APP_BEARER_TOKEN,
      }),
    })
      .then((res) => res.json())
      .then(
        (response) => {
          setSeriesList(response.results)
          window.scrollTo({ top: 0 })
        },
        (response) => {
          // TODO: Handle response error...
        }
      )
  }
  return (
    <section role="main" className="app-content row">
      {!goToDetails ? (
        <div className="max-width">
          <div className="container">
            <div className="row">
              <SortingGroup
                handleOnClickOrderBy={handleOnClickOrderBy}
                orderBy={orderBy}
              />
              <FilteringGroup
                handleOnClickFilterBy={handleOnClickFilterBy}
                filterBy={filterBy}
              />
            </div>
            <Table
              series={seriesList}
              favoritedSeriesList={favoritedSeriesList}
              handleOnClickSerie={handleOnClickSerie}
              handleOnClickIsFavorited={handleOnClickIsFavorited}
              handleOnClickIsNotFavorited={handleOnClickIsNotFavorited}
            />
          </div>
          <div className="Content__pagination-container">
            <button
              className="button button--custom"
              onClick={() => setPage(page - 1)}
            >
              Regresar
            </button>
            <span className="Content__page-text">{page}</span>
            <button
              className="button button--custom"
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : (
        <SerieDetails
          resetGotToDetails={() => setGoToDetails(false)}
          favoritedSeriesList={favoritedSeriesList}
          handleOnClickIsFavorited={handleOnClickIsFavorited}
          handleOnClickIsNotFavorited={handleOnClickIsNotFavorited}
        />
      )}
    </section>
  )
}

export default Content
