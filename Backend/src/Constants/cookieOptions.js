const accessTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge : 10 * 60 * 1000,
    sameSite: 'None',
}

const refreshTokenOptions = {
    httpOnly : true,
    secure : true,
    maxAge: 10 * 60 * 1000 * 60 * 24,
    sameSite: 'None',
}

export { 
    accessTokenOptions,
    refreshTokenOptions
}