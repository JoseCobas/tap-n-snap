const User     = require('../models/User')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if(err) {
            res.json({
                error: err
            })
        }
        let user = new User ({
            name:     req.body.name,
            email:    req.body.email,
            password: hashedPass
        })
        user.save()
        .then(user => {
            res.json({
                message: 'User Added succesfully!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error has occured'
            })
        })
    })
    
}

const login = (req, res, next) => {
    var email = req.body.email
    var password = req.body.password

    //User.findOne({$or: [{email:username},{name:username}]})
    User.findOne({$or: [{email:email}]})
    .then(user => {
        if (user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({_id: user._id}, 'thisIsThePassword', {expiresIn: '12h'})
                    res.cookie('jwt', token,{
                        httpOnly: true
                    })  
                    res.json({
                        message: 'Login Succesful!'
                    }) 
                                      
                }else{
                    res.json({
                        message: 'Password does not matched'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user user found'
            })
        }
    })
}

const user = async (req, res, next) => {
    
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'thisIsThePassword')

        if (!claims){
            res.status(401).json({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({_id: claims._id})
        const {password, ...data} = await user.toJSON()

        res.send(data)
       
}

const logout = (req, res, next) => {
    res.clearCookie('jwt')

    res.json({
        message: 'Removed succesfully'
    })
}


module.exports = {
    register, login, user, logout
}