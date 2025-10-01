router.get('/cpdlc/receive', async (req, res) => {
    const userId = req.user.id;
    try {
        const messages = await getReceivedMessages(userId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});
