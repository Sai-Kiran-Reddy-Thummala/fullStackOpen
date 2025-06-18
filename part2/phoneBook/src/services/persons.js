import axios from 'axios'

const baseURL = '/api/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
                .catch(error => {
      console.error('Failed to fetch persons:', error)
      throw error
    });
}

const create = (newObject) => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => {
        console.log(response.data)
        return response.data
    }
    )
}

const remove = id => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response.data)
                    .catch(error => {
                    console.error(`Failed to delete person with id ${id}:`, error);
                    throw error;
    });
}

const update = (id, newObject) => {
    const request = axios.put(`${baseURL}/${id}`,newObject)
    return request.then(response => response.data)
}
export default {getAll, create, remove, update}