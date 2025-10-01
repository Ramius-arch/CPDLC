router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authenticate(username, password);
        res.status(200).json({ token: user.token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
