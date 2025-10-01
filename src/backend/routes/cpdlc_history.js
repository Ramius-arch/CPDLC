router.get('/cpdlc/history', async (req, res) => {
    const userId = req.user.id;
    try {
        const history = await getMessageHistory(userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve message history' });
    }
});
