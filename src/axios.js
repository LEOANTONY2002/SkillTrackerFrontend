import axios from 'axios'

export const Axios = axios.create({
    baseURL: 'https://skilltraker.onrender.com/graphql'
})
