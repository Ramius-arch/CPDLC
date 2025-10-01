router.post('/auth/logout', async (req, res) => {
    const token = req.headers.authorization;
    try {
        await logout(token);
        res.status(200).json({ status: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log out' });
    }
});
