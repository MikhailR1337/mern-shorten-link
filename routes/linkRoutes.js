const { Router } = require('express');
const config = require('config');
const shortId = require('shortid');
const Link = require('../models/Link');
const auth = require('../middleware/authMiddlware');

const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const { from } = req.body;
        const BASEURL = config.get('baseUrl');
        const code = shortId.generate();

        const existing = await Link.findOne({ from });

        if (existing) {
            return res.status(200).json({ link: existing });
        }

        const to = BASEURL + '/t/' + code;

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save();

        res.status(201).json({ link });

    } catch (e) {
        res.status(500).json({ message: "Error, try again" });
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId });
        res.json(links);
    } catch (e) {
        res.status(500).json({ message: "Error, try again" });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById(req.params.id);
        res.json(links);
    } catch (e) {
        res.status(500).json({ message: "Error, try again" })
    }
})

module.exports = router;