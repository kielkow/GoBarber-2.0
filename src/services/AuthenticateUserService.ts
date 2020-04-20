import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new Error('Incorrect e-mail/password combination');

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new Error('Incorrect e-mail/password combination');

    const token = sign({}, ' 7f6020ebac71f75918022ff1f2e4fa32', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
