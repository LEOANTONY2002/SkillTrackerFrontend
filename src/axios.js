import axios from 'axios'

export const Axios = axios.create({
    baseURL: 'http://localhost:4001/graphql'
})
