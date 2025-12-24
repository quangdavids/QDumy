const jwt = require('jsonwebtoken')


const generateToken = (userId, res) => {
        const token = jwt.sign({userId}, 
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("jwt", token, {
            maxAge: 10 * 24 * 60 * 60 * 1000,
            sameSite: 'None',
            httpOnly: true,
            secure: true
        })
    return token;
}

module.exports = { generateToken }