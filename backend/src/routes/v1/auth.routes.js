import { Router } from 'express';
import * as AuthController from '../../controllers/auth.controller.js';
import Joi from 'joi';
import { validate } from '../../middlewares/validate.js';
import { otpLimiter } from '../../middlewares/rateLimit.js';

const router = Router();

const signupSchema = Joi.object({ body: Joi.object({ email: Joi.string().email().required(), password: Joi.string().min(6).allow(''), name: Joi.string().required() }) });
const verifyEmailSchema = Joi.object({ body: Joi.object({ email: Joi.string().email().required(), code: Joi.string().length(6).required() }) });
const loginSchema = Joi.object({ body: Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() }) });
const requestOtpSchema = Joi.object({ body: Joi.object({ email: Joi.string().email().required() }) });
const loginOtpSchema = Joi.object({ body: Joi.object({ email: Joi.string().email().required(), code: Joi.string().length(6).required() }) });
const tokenSchema = Joi.object({ body: Joi.object({ refreshToken: Joi.string().required() }) });

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmailOtp);
router.post('/login', validate(loginSchema), AuthController.loginWithPassword);
router.post('/request-login-otp', otpLimiter, validate(requestOtpSchema), AuthController.requestLoginOtp);
router.post('/login-otp', validate(loginOtpSchema), AuthController.loginWithOtp);
router.post('/token', validate(tokenSchema), AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all', AuthController.logoutAll);

export default router;


