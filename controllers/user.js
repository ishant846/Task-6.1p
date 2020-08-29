'use strict';

module.exports = function(passport, validation, email) {
    return {
        setRouting : function(router) {
            
            router.get('/login', this.loginView);
            router.post('/login', validation.getLoginValidation, this.login);
            
            router.get('/signup', this.signUpView);
            router.post('/signup', validation.getSignupValidation, this.signUp);
			
			router.get('/dashboard', this.dashboard);
            router.get('/logout', this.logOut);
        },

        loginView : function(req, res) {
            const messages = req.flash('error');
            res.render("login", {hasErrors : (messages.length > 0) ? true : false, messages : messages});
        },

        login : passport.authenticate('local.login', {
            successRedirect : '/dashboard',
            failureRedirect : '/login',
            failureFlash : true
        }),

        signUpView : function(req, res) {
            const messages = req.flash('error');
            res.render('register', { hasErrors: (messages.length > 0) ? true : false, messages: messages});
        },

        signUp : passport.authenticate('local.signup', {
            successRedirect : '/login',
            failureRedirect : '/signup',
            failureFlash : true
        }),
		
		
		dashboard: function(req, res) {
			if(req.user.firstLogin) {
				
				let mailSender = new email.MailSender();
				const mailOptions = {
					from: 'mohammadshehroz558@gmail.com',
					to: req.user.email,
					subject: "ICrowd Web Application",
					text: "Welcome to ICrowd Web Application Dear " + req.user.first_name + " "  + req.user.last_name
				};
				
				mailSender.sendMail(mailOptions, function(error, info){
					if(info) {
						req.user.firstLogin = false;
						req.user.save( (err) => {
							return res.render("dashboard", {welcome_message: "Welcome to ICrowd Web Application"});
						});
					}
				});
			
			}
			else {
				return res.render("dashboard", {welcome_message: "Welcome Again"});
			}
		},
		
        logOut: function (req, res) {
            req.logout();
            req.session.destroy((err) => {
                res.clearCookie('connect.sid', { path: '/' });
                res.redirect('/login');
            });
        },
    }
}