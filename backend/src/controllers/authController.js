const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }

      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email, password and name are required' 
        });
      }

      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();