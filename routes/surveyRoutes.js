const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {

    /* Show the user all the surveys they have created, when they come to this route */
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false});

        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for your feedback!');
    });

    /* Create the new survey and send it out to the recipients */
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map( (email)=>{ return {email: email.trim()} } ),
            _user: req.user.id,
            dateSent: Date.now()
        });

        /* Send out the emails */
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1; // Deduct credit after a survey is sent out
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
        
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact() // Remove all undefined records from events array
            .uniqBy('email', 'surveyId') // Remove duplicate records (in case a user votes twice)
            .each(({ surveyId, email, choice}) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }    
                }, {
                    $inc: { [choice]: 1 },
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }).exec
            })
            .value();


        res.send({});
    });
};