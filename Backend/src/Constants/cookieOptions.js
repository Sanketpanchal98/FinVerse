const accessTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge : 10 * 60 * 1000,
    sameSite: 'None',
}

const refreshTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'None',
}

export { 
    accessTokenOptions,
    refreshTokenOptions
}