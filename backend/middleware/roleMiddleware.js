// R14: the role is checked on the server, not just hidden in the interface
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorised, no user on the request' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: `This route is for a ${role} only` });
        }
        next();
    };
};

module.exports = { requireRole };