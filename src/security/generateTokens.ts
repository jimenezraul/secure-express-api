require('dotenv').config();
import jwt from 'jsonwebtoken';

import { TokenData } from '@/interfaces/auth.interface';
import { ACCESS_PRIVATE_KEY, REFRESH_PRIVATE_KEY, accessExpSeconds, refreshExpSeconds } from '../config/keys';
import { Token, UserDto } from '@/dtos/users.dto';

// Generate access token
export function generateAccessToken(user: UserDto): Token {
    return createToken("access_token", user, ACCESS_PRIVATE_KEY, accessExpSeconds);
}
  
// Generate refresh token
export function generateRefreshToken(user: UserDto): Token {
  return createToken("refresh_token", user, REFRESH_PRIVATE_KEY, refreshExpSeconds);
}

// Generate RS256 tokens
export function generateTokens(user: UserDto): { access_token: TokenData; refresh_token: TokenData } {
    const access_token: TokenData = generateAccessToken(user);
    const refresh_token: TokenData = generateRefreshToken(user);
    
    return { access_token, refresh_token };
}

function createToken(name: string, user: UserDto, privateKey: string, expiresIn: number): Token {
    const token = jwt.sign(user, privateKey, {
        algorithm: 'RS256',
        expiresIn
    });
    return { name: name, expiresIn, token };
}