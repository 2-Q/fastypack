
/* import package */
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import UserModel from '../../Model/UserModel.js';

/* init package */
config();



export const auth = async (_req, _res, next) => {
    const { authorization } = _req.headers
    if (!authorization) return _res.status(401).end()

    const authSplit = authorization.split(' ')
    const [AuthType, AuthToken] = [authSplit[0], authSplit[1]]
    if (AuthType !== 'Bearer') return _res.status(401).end()

    const dataUser = jwt.verify(AuthToken, (process.env.KEY_APP ?? 'ThePrivateKey'), function (err, decoded) {
        if (err) return _res.status(401).end()
        return decoded
    })

    const user = await UserModel.query().findById(dataUser.id);
    if (!user) _res.status(401).end()

    _req.user = user
    next()
}