import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcryptjs";
import passportJwt from "passport-jwt";
import type { Request } from "express";
import prisma from "./prisma";

const localVerify: passportLocal.VerifyFunction = async (
  username,
  password,
  done,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name: username }, { email: username }],
      },
      select: {
        id: true,
        bio: true,
        email: true,
        avatarUrl: true,
        password: true,
        name: true,
        reviews: true,
        library: true,
      },
    });

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const { password, ...rest } = user;
      return done(null, rest);
    } else if (!match) {
      return done(null, false, { message: "Invalid username or password" });
    }
  } catch (e) {
    return done(e);
  }
};

const cookieExtractor = (req: Request) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }

  return jwt;
};

const configLocal = () => {
  const localStrategy = new passportLocal.Strategy(localVerify);

  passport.use(localStrategy);
};

const jwtOptions: passportJwt.StrategyOptionsWithSecret = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET,
};

const configJwt = () => {
  const jwtStrategy = new passportJwt.Strategy(
    jwtOptions,
    async (payload, done) => {
      const user = await prisma.user.findFirst({
        where: {
          id: payload.id,
        },
        include: {
          reviews: true,
          library: true,
        },
      });

      if (user) {
        return done(null, user);
      } else if (!user) {
        done(null, false);
      }
    },
  );

  passport.use(jwtStrategy);
};

export { configLocal, configJwt };
