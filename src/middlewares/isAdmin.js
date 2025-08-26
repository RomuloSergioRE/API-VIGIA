const isAdmin = (req, res, next) => {
    if (req.role !== true) {
        return res.status(403).send({ message: "Require Admin Role!" });
    }
    next();
}

export default isAdmin;