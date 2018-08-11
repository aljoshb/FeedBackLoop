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
    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for your feedback!');
    });

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

        const events = _.map(req.body, ({ email, url }) => {
            const match = p.test(new URL(url).pathname);
            if (match) {
                return { email, surveyId: match.surveyId, choice: match.choice };
            }
        });

        const compactEvents = _.compact(events); // Remove all undefined records from events array
        const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId'); // Remove duplicate records (in case a user votes twice)

        console.log(uniqueEvents);

        res.send({});
    });
};