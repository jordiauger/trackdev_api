
module.exports = function (app) {

    var P = app.Promise;
    var db = app.db;

    var util = require('../util');
    var dao = require('../dao')(app);

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service:'gmail',
        secure:false,
        port:25,
        auth:{
            user:'XXXXXXXXXX@gmail.com',
            pass:'XXXXXXXXXXX'
        },
        tls: {
            rejectUnauthorized:false
        }
    });
    var plainText = 'You where invited tu use trackdev, come see';
    var mailOpts = {
        from: '"Trackdev - no reply" <XXXXXXXXX@gmail.com',
        subject:'Invited to use TrackDev!'
    };

    return {
        sendM: function (req,res) {
            util.checkParams(req.body, ['emails','type']);
            var emailsArray = req.body.emails.split(",");

            var promiseCreation=[];
            for (var x = 0; x < emailsArray.length; x++){
                var UserToCreate = {
                    "email":emailsArray[x],
                    "user_type":req.body.type,
                    "active":0,
                    "registration_code":util.makeid()
                };
                promiseCreation.push(
                    new P.Promise(function(resolve,reject) {
                        dao.User.create(UserToCreate).then(function(User){
                            resolve(User)
                        }).catch(function(){
                            reject(null);
                        })
                    })
                );
            }

            var PromisesArray = [];
            P.Promise.all(promiseCreation)
                .then(function(resultsArray){
                    for (var i = 0; i < resultsArray.length; i++){
                        var uData = resultsArray[i];
                        PromisesArray.push(new P.Promise(function(resolve,reject){
                            var mailOptsConf = Object.assign({}, mailOpts);
                            mailOptsConf['to'] = uData.dataValues.email;
                            mailOptsConf['text'] = plainText+' http://localhost:3001/register/'+uData.dataValues.registration_code;
                            transporter.sendMail(mailOptsConf, function(error, response) {  //callback
                                if (error) {
                                    reject();
                                } else {
                                    resolve();
                                }
                            })
                        }));

                        P.Promise.all(PromisesArray)
                            .then(function(){
                                console.log("the messages were sent!");
                                //res.sendStatus(200)
                            }).catch(function(){
                                console.log("messageFailed!")
                                //res.sendStatus(500);
                            })
                    }
                })
                .catch(util.resendError.bind(util, res))
                .done();

        }
    }
}
