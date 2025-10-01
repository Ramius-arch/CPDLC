router.put('/cpdlc/settings', async (req, res) => {
    const { settings } = req.body;
    try {
        await updateCpdlcSettings(req.user.id, settings);
        res.status(200).json({ status: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});
