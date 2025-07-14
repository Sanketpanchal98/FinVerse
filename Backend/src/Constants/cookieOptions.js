const accessTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge : 10 * 60 * 1000
}

const refreshTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge: 10 * 60 * 1000 * 60 * 24
}

export { 
    accessTokenOptions,
    refreshTokenOptions
}