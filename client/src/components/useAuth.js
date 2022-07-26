/** A custom hook used to handle all authentication **/
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useAuth(code) {
    /* Stores the users accessToken, refreshToken and expiresIn in state, and runs backend API
       once the code changes
    */
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        /*call backend API*/
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({},null,"/")
        }).catch(() => {
            window.location = "/"
        })
    }, [code])

    /* Need to check to see if we have a refresh token, since its async and runs 
       before previous useEffect on first render */
    useEffect(() => {
        if (refreshToken && expiresIn) {

            const interval = setInterval(() => {
                axios.post('/refresh', {
                    refreshToken,
                }).then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIn(res.data.expiresIn)
                    window.history.pushState({},null,"/")
                }).catch(() => {
                    window.location = "/"
                })
            }, (expiresIn - 60)* 1000)

            // clear the interval if refresh token or expiresIn changes
            return () => clearInterval(interval)
        }
    }, [refreshToken, expiresIn])

    return accessToken
}