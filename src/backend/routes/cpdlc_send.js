router.post('/cpdlc/send', async (req, res) => {
    const { message } = req.body;
    try {
        await sendCpdlcMessage(message);
        res.status(201).json({ status: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});
