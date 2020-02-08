import React, { useReducer, useEffect } from 'react'
import { Card, Spinner, Alert, Pagination } from 'react-bootstrap'
import { initialState, reducer } from '../reducer'
import api from '../api'

function Reducer() {
  const [{ data, pages, error, loading }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await api.get('/todos')
      if (data.status >= 200 && data.status < 300) {
        console.log(data)
        dispatch({ type: 'HANDLE_LOADING' })
        dispatch({ type: 'HANDLE_ERROR', payload: false })
        dispatch({ type: 'SET_DATA', payload: data.data })
      }
    } catch (error) {
      dispatch({ type: 'HANDLE_LOADING' })
      dispatch({ type: 'HANDLE_ERROR', payload: true })
    }
  }

  function _renderCard(item) {
    return (
      <Card
        key={item.id}
        style={{
          padding: 5,
          backgroundColor: item.completed ? null : 'pink'
        }}
      >
        <Card.Title>
          {item.id} - {item.title}
        </Card.Title>
      </Card>
    )
  }

  function _renderData() {
    return data.map(item => {
      if (pages === 1) {
        if (item.id <= pages * 10) {
          return _renderCard(item)
        }
      } else {
        if (item.id <= pages * 10 && item.id >= pages * 10 - 9) {
          return _renderCard(item)
        }
      }
    })
  }

  function _renderPagination() {
    let items = []

    for (let i = 1; i <= data.length / 10; i++) {
      if (i >= 25 && i < data.length) {
        if (i === data.length - 1)
          items.push(<Pagination.Item key={i}>...</Pagination.Item>)
      } else {
        items.push(
          <Pagination.Item
            key={i}
            active={pages === i}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: i })}
          >
            {i}
          </Pagination.Item>
        )
      }
    }

    return (
      <Pagination style={{ justifyContent: 'center', marginTop: 10 }}>
        {items}
      </Pagination>
    )
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 50
        }}
      >
        <Spinner animation='border' variant='primary' />
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 25,
          padding: 5
        }}
      >
        <Alert variant='danger' style={{ width: '80%' }}>
          Erorr: Please try again later.
        </Alert>
      </div>
    )
  }

  return (
    <div style={{ padding: 5 }}>
      <h3 style={{ textAlign: 'center' }}>ToDo List With State</h3>

      {data && _renderData()}
      {data && _renderPagination()}
    </div>
  )
}

export default Reducer
