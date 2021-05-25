const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'misharoskin@gmail.com',
        subject: 'Welcome to kuzaz.nu!',
        text: `Welcome to kuzaz.nu ${name}, let us know if you need any assistance.`
    })
}

const sendGoodbyEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'misharoskin@gmail.com',
        subject: 'Sad to see you leave kuzaz.nu',
        text: `You're more than welcome to comeback to kuzaz.nu, ${name}.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyEmail
}

