var crypto = require("crypto");
module.exports = {
	isAdminAuthenticated: function (req, res, next) {
		session = req.session;

	
		var role = session.role;
		if (role == 1)
		return next();
		res.redirect('/dashboard');
	},
	isAuthenticated: function (req, res, next) {
		session = req.session;

	
		var role = session.role;
		if (role == 1 || role == 2 || role == 3 || role == 4)
		return next();
		res.redirect('/users/login');
	},

	isClientAuthenticated: function (req, res, next) {
		session = req.session;

	
		var role = session.role;
		if (role == 4)
		return next();
		res.redirect('/users/login');
	},

	isAuthenticatedbutnotInspection: function (req, res, next) {
		session = req.session;

	
		var role = session.role;
		if (role == 1 || role == 2 || role == 4)
		return next();
		res.redirect('/users/login');
	},


	isAdminClientAuthenticated: function (req, res, next) {
		session = req.session;

	
		var role = session.role;
		if (role == 1 || role == 4)
		return next();
		res.redirect('/users/login');
	},


	encrypt: function (text) {
		var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	},
	decrypt : function (text) {
		var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	},
	jsUcfirst : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
};

