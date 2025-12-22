import axios from 'axios'

const server = 'https://my-json-server.typicode.com/PauPuigsubira/jsonserverdemo'
const service = '/persons'
const baseUrl = '/api/persons'
const useAxios = false

const get = () => {
  if (useAxios) {
    return axios
      .get(server+service)
      .then(response => {
        const { data } = response
        return data
      })
  }

  return fetch(baseUrl)
    .then(responsePromise => responsePromise.json())
    .then(responseJSON => {
      return responseJSON
    })
}

const add = (newPerson) => {
  if (useAxios) {
    return axios
      .post(baseUrl,newPerson)
      .then(response => {
        const {data} = response
        return data
      })
    }

  return fetch(
    baseUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json'
      },
      body: JSON.stringify(newPerson)
    }
  )
  .then(responsePromise => responsePromise.json())
  .then(responseJSON => { 
    return responseJSON
  })
}

const remove = (id) => {
  const item = `/${id}`

  if (useAxios) {
    return axios
      .delete(baseUrl)
      .then(response => {
        const {status} = response
        return status
      })
  }

  return fetch (
    baseUrl+item,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json'
      }
    }
  )
  .then(responsePromise => responsePromise.status)
}

const update = (objPerson) => {
  const item = `/${objPerson.id}`

  if (useAxios) {
    return axios
      .put(server+service+item, objPerson)
      .then(response => {
        const { data } = response
        return data
      })
  }

  return fetch(
    server+service+item,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json'
      },
      body: JSON.stringify(objPerson)
    }
  )
  .then(responsePromise => {
    if (responsePromise.status === 200) {
      return objPerson
    }
    return {}
  })
}

export default { get, add, remove, update }