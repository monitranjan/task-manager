import jwt from 'jsonwebtoken';
import User from "../model/user";

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'HelloMonit');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send("Please Authenticate");
    }
}

export default auth;