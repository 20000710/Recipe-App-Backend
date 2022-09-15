const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sendEmail = require('../helpers/sendEmail');
const jwtToken = require('../helpers/generateJWTToken');
const { success, failed } = require('../helpers/response');
const authModel = require('../models/auth.model');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const emailCheck = await authModel.findBy('email', email);
      if (emailCheck.rowCount == 0) {
        const id = uuidv4();
        const level = 1;
        const isActive = false;
        const isVerified = false;
        const verifyToken = crypto.randomBytes(16).toString('hex');
        const passwordHashed = await bcrypt.hash(password, 10);
        const photo = 'user_default.png';

        const data = {
          id,
          name,
          email,
          phone,
          passwordHashed,
          photo,
          level,
          verifyToken,
          isVerified,
          isActive,
        };
        await authModel.register(data);
        sendEmail.sendConfirmationEmail(email, verifyToken, name);
        success(res, {
          code: 200,
          status: 'success',
          message: 'register succcess',
          data: data,
        });
      } else {
        const err = {
          message: 'email is already registered',
        };
        failed(res, {
          code: 409,
          status: 'error',
          message: err.message,
          error: [],
        });
        return;
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error,
        error: [],
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isRegistered = await authModel.findBy('email', email);
      if (isRegistered.rowCount > 0) {
        if (isRegistered.rows[0].is_verified == true) {
          if (isRegistered.rows[0].is_active == true) {
            bcrypt
              .compare(password, isRegistered.rows[0].password)
              .then(async (match) => {
                if (match) {
                  const token = await jwtToken({
                    id: isRegistered.rows[0].id,
                    level: isRegistered.rows[0].level,
                  });
                  success(res, {
                    code: 200,
                    status: 'success',
                    message: 'login success',
                    token: token,
                  });
                } else {
                  success(res, {
                    code: 500,
                    status: 'error',
                    message: 'wrong email or password',
                    error: [],
                  });
                }
              });
          } else {
            const err = {
              message: 'your account is disabled, contact administrator',
            };
            failed(res, {
              code: 500,
              status: 'error',
              message: err.message,
              error: [],
            });
            return;
          }
        } else {
          const err = {
            message: 'account not verified by email',
          };
          failed(res, {
            code: 500,
            status: 'error',
            message: err.message,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: 'email not registered',
          error: [],
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const verifyTokenCheck = await authModel.findBy('verify_token', token);
      if (verifyTokenCheck.rowCount > 0) {
        await authModel
          .verifyingEmail(token)
          .then(() => {
            res.send(`
      <center>
      <div>
        <h1>Activation Success</h1>
      </div>
      </center>
        `);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const err = {
          message: 'verify token is invalid',
        };
        failed(res, {
          code: 500,
          status: 'error',
          message: err.message,
          error: [],
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error.message,
        error: [],
      });
    }
  },
};
module.exports = authController;
