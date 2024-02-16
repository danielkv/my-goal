require('dotenv/config')

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA2NTU0NjAwLCJpYXQiOjE3MDY1NTEwMDAsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6NTQzMjEvYXV0aC92MSIsInN1YiI6ImJiZmNkODFhLWI2NDMtNDc3Yi04ZTQ0LTRhOWFhNWYwNjMzYyIsImVtYWlsIjoiZGFuaWVsa3ZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MDY1NTEwMDB9XSwic2Vzc2lvbl9pZCI6IjdhNjVkYTFjLTU3NTQtNDk5Zi1hMmZlLTMzN2U1NjIyYTk0NiJ9.lj92vDs6_stZgyX6Ar1lF21Pbb4V5g6MuwjWWHDHakI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
    // const {
    //     data: { session },
    //     error: loginError,
    // } = await supabase.auth.signInWithPassword({ email: 'danielkv@gmail.com', password: '123456' })
    // if (loginError) return console.error(loginError)
    // console.log(session.access_token)

    const { error, data } = await supabase.auth.signInWithPassword({ email: 'danielkv@gmail.com', password: '123456' })
    if (error) return console.error(error)

    console.log(JSON.stringify(data, null, 2))
}

run()
